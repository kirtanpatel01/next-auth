import { auth } from "@/auth";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth.actions";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="min-h-screen">
      {/* <span className="text-[21.3rem] font-black text-purple-700 tracking-wider">Kiton</span> */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      {user ? (
        <div className="p-8 space-x-4">

          <span>
            <span className="text-purple-500 text-lg font-bold tracking-wider">{user.name}, </span>
            You&apos;re authenticated!
          </span>
          <Button onClick={logoutAction} variant="destructive" className="cursor-pointer">Logout</Button>
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
