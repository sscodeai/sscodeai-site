# SSCodeAI Site

`superpowers-ja` と `agency-agents-ja` のための技術ブログ、製品ドキュメント、tutorial、video hub です。

## Development

```bash
mise install
npm install
npm run sync:content
npm run dev
```

## Build

```bash
npm run build
```

## Code Review Graph

This repository uses [`code-review-graph`](https://github.com/tirth8205/code-review-graph) as an optional maintenance aid.

After meaningful code or content-structure changes, update the graph and review the impact before pushing:

```bash
code-review-graph build
npm run build
```

When using an MCP-enabled coding agent, ask it to run the `code-review-graph` review context for this repository before finalizing changes. For small documentation-only edits, a quick graph update is enough; for scripts, routing, generated content, or build configuration changes, review blast radius and affected flows.

Cloudflare Pages:

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | 22 |

## Open Source Policy

Recommended:

- Keep this site repository public if the goal is SEO, trust, and inbound discovery.
- Keep drafts, unreleased launch plans, analytics exports, customer names, and paid course material private.
- Use public MDX pages for documentation, tutorials, transcripts, and examples.
