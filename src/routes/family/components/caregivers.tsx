import { Button } from '@/components/ui/button'
import { useFamilyContext, type Caregiver } from '../wrapper'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { CardList } from '@/components/card-list'

type PayButtonProps = {
  caregiver: Caregiver
}

function PayButton({ caregiver }: PayButtonProps) {
  if (caregiver.status === 'pending') {
    return <Badge variant="destructive">Pending</Badge>
  } else if (caregiver.status === 'denied') {
    return <Badge variant="destructive">Denied</Badge>
  }

  return (
    <Button asChild>
      {/* TODO: Add payment link */}
      <Link to="/family/caregivers">Pay</Link>
    </Button>
  )
}

export function CaregiversList() {
  const { caregivers } = useFamilyContext()

  return (
    <CardList
      items={caregivers.map((caregiver) => {
        return (
          <div className="flex justify-between">
            <strong className="text-lg">{caregiver.name}</strong>
            <PayButton caregiver={caregiver} />
          </div>
        )
      })}
    />
  )
}
