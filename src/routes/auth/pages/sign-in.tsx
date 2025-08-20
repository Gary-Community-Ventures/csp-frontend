import { SignIn } from '@clerk/clerk-react'
import { useSearch } from '@tanstack/react-router'

export function SignInPage() {
  const search = useSearch({ from: '/auth/sign-in' }) // Specify the route

  const redirectUrl = search.redirect_url
  const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN

  // Validate redirectUrl to prevent open redirect vulnerabilities.
  // Only allow redirects to the VITE_BACKEND_DOMAIN.
  const isValidRedirectUrl =
    redirectUrl && redirectUrl.startsWith(backendDomain)
  const finalRedirectUrl = isValidRedirectUrl
    ? decodeURIComponent(redirectUrl)
    : undefined

  return (
    <div>
      <SignIn fallbackRedirectUrl={finalRedirectUrl} />
    </div>
  )
}
