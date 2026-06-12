---
title: "Build an Aggregate Search Using Strategy Pattern"
slug: "aggregate-search-strategy-pattern"
date: "2025-10-18"
summary: "Applying the strategy pattern to combine multiple search providers behind a clean and extensible interface."
keywords:
  - Strategy Pattern
  - Search
  - TypeScript
  - Design Patterns
---

An aggregate search can query multiple providers and merge the results. The strategy pattern keeps every provider implementation isolated.

```ts
interface SearchStrategy {
  search(query: string): Promise<SearchResult[]>;
}

class AggregateSearch {
  constructor(private readonly strategies: SearchStrategy[]) {}

  async search(query: string) {
    const results = await Promise.all(
      this.strategies.map((strategy) => strategy.search(query))
    );

    return results.flat();
  }
}
```
