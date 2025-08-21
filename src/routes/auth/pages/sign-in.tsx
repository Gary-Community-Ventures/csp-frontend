import { SignIn } from '@clerk/clerk-react'
import { useSearch } from '@tanstack/react-router'

export function SignInPage() {
  const search = useSearch({ from: '/auth/sign-in' })

  const redirectUrl = search.redirect_url
  const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN

  // Validate redirectUrl to prevent open redirect vulnerabilities.
  // Only allow redirects to the VITE_BACKEND_DOMAIN.
  const isValidRedirectUrl =
  let isValidRedirectUrl = false;
  if (redirectUrl) {
    try {
      const url = new URL(redirectUrl);
      isValidRedirectUrl = url.origin === backendDomain;
    } catch (e) {
      isValidRedirectUrl = false;
    }
  }
  const finalRedirectUrl = isValidRedirectUrl
    ? decodeURIComponent(redirectUrl)
    : undefined

  return (
    <div>
      <SignIn fallbackRedirectUrl={finalRedirectUrl} />
    </div>
  )
}
