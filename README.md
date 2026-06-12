# Hamzeen Next.js Portfolio

A static Next.js portfolio and blog designed for GitHub Pages.

## What this includes

- Portfolio pages using a black-background / white-text theme inspired by the existing static site.
- Static pages: Home, About, Contact, Blog and Search.
- Blog posts stored as Markdown under `content/blogs`.
- Build-time `public/keywords.json` and `public/search-index.json` generation.
- Global client-side search across pages, blog titles, summaries and keywords.
- Code highlighting for Markdown code fences using Shiki through `@shikijs/rehype`.
- GitHub Pages deployment workflow.

## Commands

| Command         | Purpose                                         |
| --------------- | ----------------------------------------------- |
| `npm install`   | Install dependencies                            |
| `npm run dev`   | Start local development server                  |
| `npm run build` | Generate search JSON and export the static site |

## Add a new blog

Create a new Markdown file inside `content/blogs`.

````md
---
title: "My New Blog"
slug: "my-new-blog"
date: "2026-06-12"
summary: "Short summary for listing and search."
keywords:
    - Angular
    - System Design
    - TypeScript
---

Write your blog here.

```ts
const message = "Code blocks are highlighted by Shiki";
console.log(message);
```
````

Then run:

```bash
npm run build
```

The build automatically updates:

- `public/keywords.json`
- `public/search-index.json`
- static blog pages

## GitHub Pages notes

For a user/organization Pages site like `hamzeen.github.io`, keep `NEXT_PUBLIC_BASE_PATH` empty.

For a project Pages site like `hamzeen.github.io/my-repo`, build with:

```bash
NEXT_PUBLIC_BASE_PATH=/my-repo npm run build
```

update: LC
