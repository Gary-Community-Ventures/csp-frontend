import { SignUp } from '@clerk/clerk-react'
import { signInRoute } from '../routes'
import { LanguageToggle } from '@/components/language-toggle'

export function SignUpPage() {
  return (
    <div className="relative">
      <LanguageToggle />
      <SignUp signInUrl={signInRoute.to} />
    </div>
  )
}
