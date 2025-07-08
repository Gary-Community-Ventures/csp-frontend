import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMainContext } from '@/context'

export function AboutPage() {
  const { count } = useMainContext()

  return (
    <div className="flex items-center justify-center">
      <Card className='w-lg'>
        <CardHeader>
          <CardTitle>Here is an example about page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The count is at {count}</p>
        </CardContent>
      </Card>
    </div>
  )
}
