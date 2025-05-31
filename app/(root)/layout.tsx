import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    return (
        <main className="flex">
            <Sidebar session={session}/>
            {children}
        </main>
    );
}