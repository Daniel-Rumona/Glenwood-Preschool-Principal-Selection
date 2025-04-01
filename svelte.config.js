import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      out: 'build', // specify build output directory
      precompress: false,
      envPrefix: '',
      polyfill: true
    }),
    alias: {
      "@/*": "src/*", // Adjust path to match your project structure
    }
  }
};

export default config;
