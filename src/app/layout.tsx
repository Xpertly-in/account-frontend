"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import "react-quill/dist/quill.snow.css";
import { Header } from "@/components/layout/Header.component";
import { FooterWrapper } from "@/components/layout/FooterWrapper.component";
import { Providers } from "@/store/Providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <FooterWrapper />
          </div>
          <Toaster position="top-center" richColors expand closeButton />
        </Providers>
      </body>
    </html>
  );
}
