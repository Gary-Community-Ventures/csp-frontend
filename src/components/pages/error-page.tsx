
import { Button } from "@/components/ui/button";

export const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">Oops!</h1>
        <p className="text-2xl mt-4">Something went wrong.</p>
        <p className="text-lg text-gray-600 mt-2">We're sorry for the inconvenience. Please try again later.</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    </div>
  )
}
