function ErrorFallback({
  resetError,
}: {
  error: unknown
  resetError: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <h2 className="text-2xl font-bold text-destructive">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">
          We've been notified about this error and will look into it.
        </p>
        <div className="space-x-4">
          <button
            onClick={resetError}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallback
