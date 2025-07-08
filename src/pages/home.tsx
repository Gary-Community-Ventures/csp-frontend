import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMainContext } from '@/context'

export function HomePage() {
  const { setCount } = useMainContext()

  return (
    <div className="flex items-center justify-center">
      <Card className="w-lg">
        <CardHeader>
          <CardTitle>This is the home page</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setCount((count) => count + 1)}>
            Increment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
