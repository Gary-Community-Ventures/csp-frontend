import { Mail, Home, BookOpen, ListChecks, ListTodo } from 'lucide-react'
import { NavBar } from '@/components/nav-bar'
import { UserButton } from '@clerk/clerk-react'
import { useProviderContext } from '../wrapper'

export function ProviderNavBar() {
  const { providerInfo, navBar } = useProviderContext()

  if (navBar.hidden) {
    return null
  }

  return (
    <>
      <div className="flex justify-between bg-primary text-primary-foreground p-5">
        <img src="/logo.png" className="max-h-15" alt="logo" />
        <div className="flex items-center">
          <UserButton />
        </div>
      </div>
      <div className="flex justify-center items-center p-5 bg-white">
        <strong className="text-3xl text-primary">
          {providerInfo.firstName} {providerInfo.lastName}
        </strong>
      </div>
      <NavBar
        sticky={true}
        links={[
          { to: '/provider', text: 'Home', Icon: Home },
          { to: '/provider/messages', text: 'Messages', Icon: Mail },
          { to: '/provider/activity', text: 'Activity', Icon: ListChecks },
          {
            to: '/provider/resources',
            text: 'Resources',
            Icon: BookOpen,
          },
          {
            to: '/provider/attendance',
            text: 'Attendance',
            Icon: ListTodo,
          },
        ]}
      />
    </>
  )
}
