// @ts-check
import { defineConfig } from 'astro/config';
import ogIntegration from './src/lib/og-integration';

// https://astro.build/config
export default defineConfig({
  integrations: [ogIntegration()],
});
