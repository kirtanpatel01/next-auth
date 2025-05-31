import type { Metadata } from "next";
import { Inclusive_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/ModeToggle";

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "KJ_PATEL - NextAuth.js",
  description: "Authentication using Auth.js(next-auth.js)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inclusiveSans.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>
          <Toaster richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
