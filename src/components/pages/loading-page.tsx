
import { Loader2 } from "lucide-react";

export const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="text-xl text-gray-700 mt-4">Loading content...</p>
    </div>
  );
};
