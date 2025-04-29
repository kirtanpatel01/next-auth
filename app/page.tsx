import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const user = false;
  return (
    <div className="min-h-screen">
      {/* <span className="text-[21.3rem] font-black text-purple-700 tracking-wider">Kiton</span> */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      {user ? (
        <div className="p-8 space-x-4">
          <span>You're authenticated!</span>
          <Button variant="destructive">Logout</Button>
        </div>
      ) : (
        <div className="p-8 space-x-4">
          <span>Login required!</span>
          <Button variant={'link'} className="cursor-pointer">
            <Link href={'/auth/login'}>Login</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
