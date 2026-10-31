// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

import react from '@astrojs/react';

const SITE = 'https://wikiofautomation.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  prefetch: { defaultStrategy: 'hover' },
  trailingSlash: 'ignore',
  security: {
    checkOrigin: false,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'bn', 'hi'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en-US',
        locales: { 'en-US': 'en', 'bn': 'bn', 'hi': 'hi' },
      },
    }),
    pagefind(),
  ],
  vite: {
    define: {
      'import.meta.env.PUBLIC_MINIMAX_API_KEY': JSON.stringify(process.env.PUBLIC_MINIMAX_API_KEY || process.env.MINIMAX_API_KEY || process.env.LLM_API_KEY || ''),
      'import.meta.env.PUBLIC_MINIMAX_BASE_URL': JSON.stringify(process.env.PUBLIC_MINIMAX_BASE_URL || process.env.MINIMAX_BASE_URL || process.env.LLM_API_URL || 'https://api.minimax.io/v1'),
      'import.meta.env.PUBLIC_MINIMAX_MODEL': JSON.stringify(process.env.PUBLIC_MINIMAX_MODEL || process.env.MINIMAX_MODEL || process.env.LLM_MODEL || 'MiniMax-M3'),
    },
    ssr: {
      // Keep native C++ modules external so their native bindings (.node) are
      // loaded at runtime from node_modules instead of being bundled by Vite.
      external: ['better-sqlite3', '@node-rs/argon2'],
      noExternal: [],
    },
    optimizeDeps: {
      exclude: ['better-sqlite3', '@node-rs/argon2'],
    },
  },
});
