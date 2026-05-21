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
        // Add proper cache-busting filename patterns
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id))
            return 'react-vendor'
          if (id.includes('@clerk/')) return 'clerk-vendor'
          if (id.includes('@radix-ui/')) return 'radix-vendor'
          if (id.includes('@tanstack/')) return 'tanstack-vendor'
          if (id.includes('@sentry/')) return 'sentry-vendor'
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
        cleanupOutdatedCaches: true,
        // Only precache JS and CSS (hashed assets) - not HTML
        globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
        // Serve index.html for all navigation requests (SPA)
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [
          /^https:\/\/csp-backend-staging-9941beb4ce92\.herokuapp\.com\//,
          /^https:\/\/api\.capcolorado\.org\//,
        ],
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
      },
      // Force reload when new SW takes control
      selfDestroying: false,
      includeAssets: [
        'favicon.png',
        'cap_circle_logo_white.png',
        'cap_full_logo_white.png',
        'bimi.svg',
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
              // Use SOURCE_VERSION as release name for proper versioning on Heroku
              name: process.env.SOURCE_VERSION || undefined,
              // This will inject the release version into your app
              inject: true,
            },
            sourcemaps: {
              // Auto-detect and upload source maps
              filesToDeleteAfterUpload: ['./dist/**/*.map'],
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
