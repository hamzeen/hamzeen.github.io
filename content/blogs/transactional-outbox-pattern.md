---
title: "Transactional Outbox and the Dual-Write Problem"
slug: "transactional-outbox-pattern"
date: "2026-07-02"
author: "Hamzeen Hameem"
summary: "The transactional outbox pattern solves the dual-write problem and enables reliable event publishing in distributed backends."
keywords:
    - Transactional Outbox
    - Dual-Write Problem
    - Event-Driven Architecture
    - Distributed Systems
    - Message Brokers
    - Backend Architecture
    - Reliability
    - Microservices
---

In a distributed system, a database change often needs to be communicated reliably to other services.

For example, after a banking service posts a transfer, other services may need to send a notification, update a statement, perform fraud analysis, or feed the transaction into reporting systems.

These workflows depend on events such as `TRANSFER_POSTED`.

```txt
Transfer Service
      |
      | TRANSFER_POSTED
      v
Message Broker
      |
      +--> Notification Service
      +--> Statement Service
      +--> Fraud Service
      +--> Analytics Service
```

The event must be published reliably. If the transfer is committed but the event is lost, the source database contains the correct state while downstream systems remain unaware of it.

## The dual-write problem

A service may try to perform two independent writes:

```txt
1. Commit the business change to its database
2. Publish an event to a message broker
```

This creates the **dual-write problem** because the database and message broker do not normally share the same local transaction.

If the database commit succeeds but event publishing fails, the business change exists without its event. Publishing the event first is also unsafe because downstream services could receive an event for a database transaction that later fails.

```txt
Database commit succeeds
        |
        X  Service crashes
        |
Event is never published
```

In-memory retries alone do not remove this risk. If the service crashes after committing the database transaction but before recording or publishing the event, there may be nothing durable to retry.

## The transactional outbox pattern

The transactional outbox pattern solves the dual-write problem by atomically committing the database state change and a durable record of the event.

Instead of publishing directly to the message broker, the service writes the event to an outbox table in the same database transaction as the business data.

```txt
Single database transaction
    |
    +--> Update business data
    |
    +--> Insert outbox event
    |
    v
Commit together
```

Both database operations now succeed or fail together.

A separate process, commonly called an **outbox worker**, **message relay**, or **publisher**, later reads pending events from the outbox table and publishes them to the message broker.

```txt
Business transaction
        ↓
Business tables + Outbox table → Outbox worker → Message broker → Downstream services
```

The important distinction is that the pattern does **not** make the database update and broker publication one atomic operation. It makes the business change and the creation of a durable event record atomic. The event is then published asynchronously and can be retried until it succeeds.

## Applying the Outbox Pattern to a Bank Transfer

Imagine a customer transfers **$100.00** from Account A to Account B.

The Transfer Service must:

1. Update the account balances.
2. Create a ledger entry.
3. Publish a `TRANSFER_POSTED` event.

The account updates, ledger entry, and outbox event are committed in one database transaction:

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 100.00
WHERE id = 'account_A'
  AND balance >= 100.00;

UPDATE accounts
SET balance = balance + 100.00
WHERE id = 'account_B';

INSERT INTO ledger_entries (
  transfer_id,
  debit_account_id,
  credit_account_id,
  amount,
  currency,
  status
)
VALUES (
  'transfer_123',
  'account_A',
  'account_B',
  100.00,
  'USD',
  'POSTED'
);

INSERT INTO outbox_events (
  id,
  event_type,
  aggregate_type,
  aggregate_id,
  payload,
  status,
  created_at
)
VALUES (
  'event_456',
  'TRANSFER_POSTED',
  'TRANSFER',
  'transfer_123',
  jsonb_build_object(
    'eventId', 'event_456',
    'transferId', 'transfer_123',
    'fromAccountId', 'account_A',
    'toAccountId', 'account_B',
    'amount', 100.00,
    'currency', 'USD'
  ),
  'PENDING',
  now()
);

COMMIT;
```

Now the database has committed both the posted transfer and its outbox event.

### ledger_entries

| transfer_id  | debit_account_id | credit_account_id | amount | currency | status |
| ------------ | ---------------- | ----------------- | ------ | -------- | ------ |
| transfer_123 | account_A        | account_B         | 100.00 | USD      | POSTED |

### outbox_events

| id        | event_type      | aggregate_type | aggregate_id | status  | created_at              |
| --------- | --------------- | -------------- | ------------ | ------- | ----------------------- |
| event_456 | TRANSFER_POSTED | TRANSFER       | transfer_123 | PENDING | 2026-07-02 10:42:18 UTC |

The outbox worker then processes the event:

```txt
1. Read the pending outbox event
2. Publish TRANSFER_POSTED to the message broker
3. Receive acknowledgement from the broker
4. Mark the outbox event as processed
```

If the broker is unavailable, the transfer remains safely committed and the event remains available for a later retry.

A worker can also fail after publishing an event but before marking it as processed. The event may then be published again. For this reason, outbox-based systems commonly provide **at-least-once delivery**, and downstream consumers should handle duplicate events idempotently using the event ID.

## Where else is it useful?

The same pattern can be used when:

- An order must trigger payment, inventory, or fulfilment workflows.
- A successful payment must trigger receipt and accounting updates.
- A user registration must trigger email, CRM, or onboarding workflows.
- An inventory reservation must be propagated to other services.
- A completed file-processing job must trigger notification or moderation.
- An important business change must be delivered to audit or analytics systems.

## Conclusion

Reliable event publishing is essential when downstream services depend on events to keep their data and workflows aligned.

Directly updating a database and publishing to a broker creates a dual-write problem because a failure can occur between the two operations.

The transactional outbox pattern addresses this by atomically storing the business change and its event record in the same database transaction. A separate worker publishes the stored event afterward and retries when necessary.

> Use the transactional outbox pattern when a committed database change must reliably produce an event for another service.
