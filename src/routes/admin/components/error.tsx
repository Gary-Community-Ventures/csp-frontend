
import { Button } from "@/components/ui/button";

export const ErrorComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-lg text-gray-500">
        Please try again later.
      </p>
      <Button onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  )
}
