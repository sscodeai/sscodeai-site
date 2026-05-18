# SSCodeAI Site

SSCodeAI is a technical blog, product documentation, tutorial, and video hub for `superpowers-ja` and `agency-agents-ja`. It hosts public guides, practical examples, project documentation, and future personal technical profile content.

SSCodeAI は、`superpowers-ja` と `agency-agents-ja` のための技術ブログ、製品ドキュメント、tutorial、video hub です。公開ドキュメント、使い方、実務 scenario、個人 technical profile をまとめる場所として運用します。

## Development

Local development uses `mise` to manage Node 22. Install dependencies first, then start the Astro dev server.

ローカル開発では `mise` で Node 22 系を管理します。初回は dependencies を install し、その後 Astro dev server を起動します。

```bash
mise install
npm install
npm run sync:content
npm run dev
```

## Build

Production builds emit static files to `dist/`. Cloudflare Pages deploys that directory directly.

Production build は静的ファイルを `dist/` に出力します。Cloudflare Pages はこの directory をそのまま deploy します。

```bash
npm run build
```

## Code Review Graph

This repository uses [`code-review-graph`](https://github.com/tirth8205/code-review-graph) as an optional maintenance aid. After meaningful changes to scripts, routing, generated content, or build configuration, update the graph and review the impact before pushing.

この repository では [`code-review-graph`](https://github.com/tirth8205/code-review-graph) を任意の maintenance aid として使います。scripts、routing、generated content、build config に意味のある変更が入った場合は、push 前に graph を更新し、影響範囲を確認します。

Manual check:

手動確認:

```bash
code-review-graph build
npm run build
```

When using an MCP-enabled coding agent, ask it to run the `code-review-graph` review context before finalizing changes. A quick check is enough for small documentation-only edits; for scripts, routing, generated content, or build configuration changes, review blast radius and affected flows.

MCP 対応の coding agent を使う場合は、最終化前に `code-review-graph` の review context を実行させます。小さな docs-only change なら quick check で十分ですが、scripts、routing、generated content、build config の変更では blast radius と affected flows を確認します。

## Cloudflare Pages

If Cloudflare Pages is already connected to the GitHub repository, use the following build settings.

Cloudflare Pages で GitHub repository を接続済みの場合は、次の build settings を使います。


| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | 22 |

## Open Source Policy

Keeping this site repository public is recommended. Public docs, tutorials, video transcripts, and case-study pages help SEO, trust-building, and external collaboration. Keep unreleased plans, customer information, paid content scripts, and analytics exports in a private repository or private storage.

この site repository は public 運用を推奨します。公開 docs、tutorial、video transcript、case study は SEO、信頼性、外部 collaboration に効きます。一方、未公開 launch plan、顧客情報、有料 content script、analytics export は private repository または private storage に置きます。

Recommended / 推奨:

- Keep this site repository public if the goal is SEO, trust, and inbound discovery.
- Keep drafts, unreleased launch plans, analytics exports, customer names, and paid course material private.
- Use public MDX pages for documentation, tutorials, transcripts, and examples.
