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
