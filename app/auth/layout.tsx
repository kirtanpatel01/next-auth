import { ModeToggle } from "@/components/ModeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
            {children}
        </section>
    );
}