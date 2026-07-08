import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  site: "https://amy22707.github.io/",
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  },
  integrations: [mdx()]
});
