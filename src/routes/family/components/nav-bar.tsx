import {
  House,
  Mail,
  HeartHandshake,
  MessageCircleQuestionMark,
  Settings,
} from 'lucide-react'
import { NavBar } from '@/components/nav-bar'
import { UserButton } from '@clerk/clerk-react'
import { useFamilyContext } from '../wrapper'

export function FamilyNavBar() {
  const { householdInfo } = useFamilyContext()
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
          {householdInfo.firstName} {householdInfo.lastName}
        </strong>
      </div>
      <NavBar
        sticky={true}
        links={[
          { to: '/family', text: 'Home', Icon: House },
          { to: '/family/activity', text: 'Activity', Icon: Mail },
          {
            to: '/family/providers',
            text: 'Providers',
            Icon: HeartHandshake,
          },
          {
            to: '/family/help',
            text: 'Help',
            Icon: MessageCircleQuestionMark,
          },
          { to: '/family/settings', text: 'Settings', Icon: Settings },
        ]}
      />
    </>
  )
}
