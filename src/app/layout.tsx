import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from '@/components/ui/sonner'
import { AuthWrapper } from '@/components/auth/auth-wrapper'

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "MAT Platform",
  description: "Maintenance Assistance Tool for African Property Owners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <AuthWrapper>{children}</AuthWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}