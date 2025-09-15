import * as Sentry from '@sentry/react'
import { router } from '@/routes/router'

const environment = import.meta.env.VITE_APP_ENV || 'development'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN

// Declare the global SENTRY_RELEASE variable that the plugin injects
declare global {
  interface Window {
    SENTRY_RELEASE?: {
      id: string
    }
  }
}

export function initializeSentry() {
  // In production, the SENTRY_RELEASE is injected at the very top of the bundle
  // but we'll check for it just to be safe
  const releaseId = window.SENTRY_RELEASE?.id
  
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: environment,
      // The Sentry Vite plugin injects this automatically during build
      release: releaseId,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: environment === 'production',
          blockAllMedia: environment === 'production',
        }),
      ],
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
      replaysSessionSampleRate: environment === 'production' ? 0.01 : 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  }

  router.subscribe('onBeforeLoad', ({ pathChanged, toLocation }) => {
    if (pathChanged) {
      Sentry.addBreadcrumb({
        category: 'navigation',
        message: `Navigating to ${toLocation.pathname}`,
        level: 'info',
      })
    }
  })
}
