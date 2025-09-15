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
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
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
    ...(process.env.SENTRY_AUTH_TOKEN ? [sentryVitePlugin({
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
        // Optional: Delete source maps after upload to keep them private
        filesToDeleteAfterUpload: ['./dist/**/*.map'],
      },
    })] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
})
