import { UserButton } from '@clerk/clerk-react';

export function FamilyHeader() {
  return (
    <div className="flex justify-between bg-primary text-primary-foreground p-5">
      <img src="/logo.png" className="max-h-15" alt="logo" />
      <div className="flex items-center">
        <UserButton />
      </div>
    </div>
  );
}
