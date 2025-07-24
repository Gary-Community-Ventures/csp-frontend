
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-400">404</h1>
        <p className="text-2xl mt-4">Page Not Found</p>
        <p className="text-lg text-gray-600 mt-2">The page you are looking for does not exist.</p>
        <Button className="mt-6" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
};
