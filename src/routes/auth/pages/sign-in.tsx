import { SignIn } from '@clerk/clerk-react'
import { useSearch } from '@tanstack/react-router'

export function SignInPage() {
  const search = useSearch({ from: '/auth/sign-in' })

  const redirectUrl = search.redirect_url
  const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN

  // Validate redirectUrl to prevent open redirect vulnerabilities.
  // Only allow redirects to the VITE_BACKEND_DOMAIN.
  let finalRedirectUrl: string | undefined = undefined
  if (redirectUrl && backendDomain) {
    try {
      const url = new URL(redirectUrl)
      const isValidRedirectUrl = url.origin === backendDomain
      if (isValidRedirectUrl) {
      const decodedRedirectUrl = decodeURIComponent(redirectUrl)
      const url = new URL(decodedRedirectUrl)
      const isValidRedirectUrl = url.origin === backendDomain
      if (isValidRedirectUrl) {
        finalRedirectUrl = decodedRedirectUrl
      }
    } catch (e) {
      console.error('Invalid redirect URL', e)
    }
  }

  return (
    <div>
      <SignIn fallbackRedirectUrl={finalRedirectUrl} />
    </div>
  )
}
