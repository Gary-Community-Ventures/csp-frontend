import { Button } from '@/components/ui/button'
import { useFamilyContext, type Caregiver } from '../wrapper'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { CardList } from '@/components/card-list'

type PayButtonProps = {
  caregiver: Caregiver
}

function PayButton({ caregiver }: PayButtonProps) {
  if (!caregiver.aproved) {
    return <Badge variant="destructive">Pending</Badge>
  }

  return (
    <Button asChild>
      {/* TODO: Add payment link */}
      <Link to="/family/providers">Pay</Link>
    </Button>
  )
}

export function CareGiversList() {
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
