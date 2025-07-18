import { Mail, Home, BookOpen, ListChecks, ListTodo } from 'lucide-react'
import { NavBar } from '@/components/nav-bar'
import { UserButton } from '@clerk/clerk-react'
import { useCaregiverContext } from '../wrapper'

export function CaregiverNavBar() {
  const { caregiverInfo, navBar } = useCaregiverContext()

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
          {caregiverInfo.firstName} {caregiverInfo.lastName}
        </strong>
      </div>
      <NavBar
        sticky={true}
        links={[
          { to: '/caregiver', text: 'Home', Icon: Home },
          { to: '/caregiver/messages', text: 'Messages', Icon: Mail },
          { to: '/caregiver/activity', text: 'Activity', Icon: ListChecks },
          {
            to: '/caregiver/resources',
            text: 'Resources',
            Icon: BookOpen,
          },
          {
            to: '/caregiver/attendance',
            text: 'Attendance',
            Icon: ListTodo,
          },
        ]}
      />
    </>
  )
}
