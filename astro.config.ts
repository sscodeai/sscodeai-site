import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import nimbus, { defineConfig as defineNimbusConfig } from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";

const nimbusConfig = defineNimbusConfig({
  site: "https://sscodeai.com",
  title: "SSCodeAI",
  description: "日本の IT 開発現場向け AI coding workflow、agent library、tutorial、video hub。",
  locale: "ja",
  github: "https://github.com/sscodeai",
  socialImageAlt: "SSCodeAI documentation preview",
  versions: {
    current: "ja",
    others: ["en"],
  },
  sidebar: {
    items: [
      {
        label: "Start",
        items: [
          "overview",
          "projects",
          "profile",
          "resume",
          "deploy/cloudflare",
          "content-strategy",
          "open-source-policy",
        ],
      },
      { label: "superpowers-ja", autogenerate: { directory: "superpowers-ja" } },
      { label: "agency-agents-ja", autogenerate: { directory: "agency-agents-ja" } },
      { label: "img2threejs", autogenerate: { directory: "img2threejs" } },
      { label: "Tutorials", autogenerate: { directory: "tutorials" } },
      { label: "Videos", autogenerate: { directory: "videos" } },
    ],
  },
});

export default defineConfig({
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    nimbus(nimbusConfig, {
      markdown: {
        hastPlugins: [tableScroll()],
      },
    }),
  ],
});
