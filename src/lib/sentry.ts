import * as Sentry from '@sentry/react'
import { router } from '@/routes/router'

const environment = import.meta.env.VITE_APP_ENV || 'development'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN

export function initializeSentry() {
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: environment,
      // Release tracking helps match errors to specific source maps
      release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
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
      // Enable debug mode in development to see if source maps are working
      debug: environment === 'development',
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
