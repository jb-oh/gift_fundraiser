import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import Navigation from "@/components/Navigation";
import SpaRedirectHandler from "@/components/SpaRedirectHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "선물 펀딩 - 친구와 가족을 위한 특별한 선물",
  description: "친구와 가족을 위한 선물 펀딩을 쉽게 만들고 공유하세요. 생일, 결혼, 졸업 등 다양한 행사의 선물을 투명하게 관리하고 축하 메시지와 함께 특별한 순간을 만들어보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SpaRedirectHandler />
        <AuthProvider>
          <RoleProvider>
            <Navigation />
            {children}
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
