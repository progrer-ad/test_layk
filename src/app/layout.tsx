'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeRegistry from './ThemeRegistry';
import { I18nProvider } from '@/context/I18nProvider'
import { usePathname } from 'next/navigation'; // <-- import hook

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // hozirgi pathni olamiz

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <I18nProvider>
            {/* Navbar faqat asosiy sahifada ko‘rsatiladi */}
            {pathname === '/' && <Navbar />}
            {children}
          </I18nProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
