import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveSiteUrl, createSitemap } from './config/site.mjs';
import { canonicalPaths } from './src/app/routeCatalog.js';
import { execFileSync } from 'node:child_process';
import { createRelease } from './config/release.mjs';
import { validateArticleHtml } from './config/content-policy.mjs';
import { blogPosts } from './src/data/blogs.js';
import { cp, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = resolveSiteUrl(env.VITE_SITE_URL, { requirePublic: Boolean(process.env.AWS_APP_ID) });

  for (const post of blogPosts) validateArticleHtml(post.content);

  return {
    plugins: [
      react(),
      {
        name: 'portfolio-site-metadata',
        transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
        generateBundle() {
          this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: createSitemap(siteUrl, canonicalPaths) });
          this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` });
        },
      },
      {
        name: 'portfolio-clean-public-assets',
        async writeBundle(output) {
          await cp('public', output.dir, { recursive: true,
            filter: (source) => !path.basename(source).startsWith('.') });
          const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
          const assets = (await readdir(path.join(output.dir, 'assets'))).filter((file) => /\.(?:js|css)$/.test(file)).sort();
          const paths = ['/index.html', '/static/theme.js', ...assets.map((file) => `/assets/${file}`)];
          const files = await Promise.all(paths.map(async (file) => ({ path: file, bytes: await readFile(path.join(output.dir, file.slice(1))) })));
          await writeFile(path.join(output.dir, 'deployment.json'), JSON.stringify(createRelease(commit, siteUrl, files)) + '\n');
        },
      },
    ],
    define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) },
    server: { port: 3000, strictPort: true, open: false },
    preview: { port: 3000, strictPort: true },
    build: {
      copyPublicDir: false,
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
