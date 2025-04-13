import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header.component";
import { Footer } from "@/components/layout/Footer.component";
import { QueryProvider } from "@/components/providers/QueryProvider.component";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xpertly - Find Your Chartered Accountant",
  description: "Discover and connect with verified Chartered Accountants in your area",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
