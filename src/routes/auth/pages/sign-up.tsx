import { SignUp } from '@clerk/clerk-react'
import { signInRoute } from '../routes'
import {} from '@/routes/family/routes'

export function SignUpPage() {
  return (
    <div>
      <SignUp signInUrl={signInRoute.to} />
    </div>
  )
}
