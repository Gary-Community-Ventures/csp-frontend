import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // Enable source map generation
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild', // esbuild is faster and uses less memory than terser
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'clerk-vendor': [
            '@clerk/clerk-react',
            '@clerk/localizations',
            '@clerk/types',
          ],
          'radix-vendor': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
          ],
          'tanstack-vendor': [
            '@tanstack/react-query',
            '@tanstack/react-router',
            '@tanstack/router-devtools',
          ],
          'sentry-vendor': ['@sentry/react', '@sentry/tracing'],
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // Force service worker update on every build
        cleanupOutdatedCaches: true,
        // More aggressive caching strategy
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
        // Add build timestamp to force cache invalidation
        additionalManifestEntries: [
          {
            url: '/',
            revision: Date.now().toString(),
          },
        ],
      },
      includeAssets: [
        'favicon.png',
        'cap_circle_logo_white.png',
        'cap_full_logo_white.png',
      ],
      manifest: {
        name: 'Cap',
        short_name: 'Cap',
        description: 'Your PWA Description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon.png',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/png',
          },
          {
            src: 'cap_circle_logo_white.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'cap_full_logo_white.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    // Sentry plugin should be last - only add if we have auth token
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [
          sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            release: {
              // This will inject the release version into your app
              inject: true,
              setCommits: {
                auto: true,
              },
            },
            sourcemaps: {
              // Keep source maps but upload them to Sentry
              assets: ['./dist/**/*.js.map'],
              filesToDeleteAfterUpload: ['./dist/**/*.js.map'],
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
})
