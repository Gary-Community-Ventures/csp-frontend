import {
  House,
  Mail,
  HeartHandshake,
  ListChecks,
} from 'lucide-react'
import { NavBar } from '@/components/nav-bar'
import { useFamilyContext } from '../wrapper'

export function FamilyNavBar() {
  const { selectedChildInfo, navBar } = useFamilyContext()

  if (navBar.hidden) {
    return null
  }

  return (
    <>
      <div className="flex justify-center items-center p-5 bg-white">
        <strong className="text-3xl text-primary">
          {selectedChildInfo.firstName} {selectedChildInfo.lastName}
        </strong>
      </div>
      <NavBar
        sticky={true}
        links={[
          { to: '/family', text: 'Home', Icon: House },
          { to: '/family/messages', text: 'Messages', Icon: Mail },
          {
            to: '/family/activity',
            text: 'Activity',
            Icon: ListChecks,
          },
          {
            to: '/family/providers',
            text: 'Providers',
            Icon: HeartHandshake,
          },
        ]}
      />
    </>
  )
}
