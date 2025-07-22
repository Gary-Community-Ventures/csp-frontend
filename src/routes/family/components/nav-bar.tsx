import { House, Mail, HeartHandshake, ListChecks } from 'lucide-react'
import { NavBar } from '@/components/nav-bar'
import { useFamilyContext } from '../wrapper'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useNavigate } from '@tanstack/react-router'

export function FamilyNavBar() {
  const { selectedChildInfo, navBar, children } = useFamilyContext()
  const navigate = useNavigate()

  if (navBar.hidden) {
    return null
  }

  const changeChild = (id: string) => {
    navigate({ from: '/family/$childId/home', params: { childId: Number(id) } })
  }

  return (
    <>
      <div className="flex justify-between bg-primary text-primary-foreground p-5">
        <img src="/logo.png" className="max-h-15" alt="logo" />
        <div className="flex items-center">
          <Select
            value={String(selectedChildInfo.id)}
            onValueChange={changeChild}
          >
            <SelectTrigger>
              {selectedChildInfo.firstName} {selectedChildInfo.lastName}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {children.map((child) => (
                  <SelectItem value={String(child.id)} key={child.id}>
                    {child.firstName} {child.lastName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-center items-center p-5 bg-white">
        <strong className="text-3xl text-primary">
          {selectedChildInfo.firstName} {selectedChildInfo.lastName}
        </strong>
      </div>
      <NavBar
        sticky={true}
        links={[
          {
            to: '/family/$childId/home',
            text: 'Home',
            Icon: House,
          },
          {
            to: '/family/$childId/messages',
            text: 'Messages',
            Icon: Mail,
          },
          {
            to: '/family/$childId/activity',
            text: 'Activity',
            Icon: ListChecks,
          },
          {
            to: '/family/$childId/providers',
            text: 'Providers',
            Icon: HeartHandshake,
          },
        ]}
      />
    </>
  )
}
