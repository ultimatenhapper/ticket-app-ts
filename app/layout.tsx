import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/MainNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/auth/components/AuthProvider";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ticketer App",
  description: "Organize your projects with tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="flex flex-col items-center border-b mb-5 px-5 py-3">
            <div className="max-w-6xl w-full">
              <MainNav />
            </div>
          </nav>
          <AuthProvider>
            <Sidebar />
            <main className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] min-h-screen">
              <div className="px-6 pt-6 bg-white p-2 m-2 pb-5">{children}</div>
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
