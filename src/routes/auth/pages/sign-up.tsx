import { SignUp } from '@clerk/clerk-react'
import { signInRoute } from '../routes'

export function SignUpPage() {
  return (
    <div>
      <SignUp signInUrl={signInRoute.to} />
    </div>
  )
}
