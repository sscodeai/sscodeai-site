import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://sscodeai.com',
  integrations: [
    starlight({
      title: 'SSCodeAI',
      description: '日本の IT 開発現場向け AI coding workflow、agent library、実践 tutorial。',
      logo: {
        src: './src/assets/logo.svg',
        alt: 'SSCodeAI',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/sscodeai',
        },
      ],
      customCss: ['./src/styles/site.css'],
      sidebar: [
        {
          label: 'Start',
          items: [
            { label: 'Home', link: '/' },
            { label: 'Overview', link: '/overview/' },
            { label: 'Projects', link: '/projects/' },
            { label: 'Profile', link: '/profile/' },
            { label: 'Resume', link: '/resume/' },
            { label: 'Cloudflare Deploy', link: '/deploy/cloudflare/' },
            { label: 'Content Strategy', link: '/content-strategy/' },
            { label: 'Open Source Policy', link: '/open-source-policy/' },
          ],
        },
        {
          label: 'superpowers-ja',
          autogenerate: { directory: 'superpowers-ja' },
        },
        {
          label: 'agency-agents-ja',
          autogenerate: { directory: 'agency-agents-ja' },
        },
        {
          label: 'Tutorials',
          autogenerate: { directory: 'tutorials' },
        },
        {
          label: 'Videos',
          autogenerate: { directory: 'videos' },
        },
      ],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.png',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon.png',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'keywords',
            content: 'Claude Code, AI agent, 日本語, SIer, Backlog, Redmine, Jira, kintone, 障害報告書, 受入テスト',
          },
        },
      ],
    }),
    mdx(),
    sitemap(),
  ],
});
