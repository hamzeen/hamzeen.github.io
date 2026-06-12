---
title: "Event-Driven Backend with SSE in Node.js"
slug: "event-driven-backend-sse-nodejs"
date: "2026-06-11"
summary: "Designing a queue-based Node.js backend with image processing workers and real-time client notifications using Server-Sent Events."
keywords:
  - Node.js
  - SSE
  - BullMQ
  - Redis
  - Worker Threads
  - Sharp
  - Backend Architecture
---

A clean way to process uploaded images is to separate the request lifecycle from the expensive work.
The upload endpoint accepts files, stores metadata, places jobs on a queue and immediately returns a `batchId`.
The client then listens for progress updates over Server-Sent Events.

## Architecture

The main parts are:

1. **Express API** for upload and status endpoints.
2. **Multer** for handling multipart image uploads.
3. **BullMQ + Redis** for durable queueing.
4. **Worker Threads** for CPU-heavy image resizing.
5. **Sharp** for image manipulation.
6. **SSE** for progress updates.

```ts
import express from 'express';
import multer from 'multer';
import { Queue } from 'bullmq';

const app = express();
const upload = multer({ dest: 'uploads/' });

const imageQueue = new Queue('image-processing', {
  connection: { host: 'localhost', port: 6379 }
});

app.post('/api/images', upload.array('images', 2), async (req, res) => {
  const batchId = crypto.randomUUID();
  const files = req.files as Express.Multer.File[];

  await Promise.all(
    files.map((file) =>
      imageQueue.add('resize', {
        batchId,
        filename: file.filename,
        path: file.path,
        size: { width: 100, height: 100 }
      })
    )
  );

  res.status(202).json({ batchId });
});
```

## Why SSE works well here

SSE is a good fit when the server needs to push one-way progress events to the browser. The browser opens one connection and the backend streams status messages as text events.

```ts
app.get('/api/images/:batchId/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  send('queued', { batchId: req.params.batchId });
});
```

This keeps the upload API fast and makes the processing pipeline observable from the client.
