import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import MsalProviderWrapper from "@/msal/msalProviderWrapper";
import AuthWrapper from "@/msal/AuthWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const workSans = localFont({
  src: "./fonts/WorkSans-Bold.ttf",
  variable: "--font-worksans-bold",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TekPlace",
  description: "Epitech R/Place: Collaborative Pixel Art Platform.",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${workSans.variable} antialiased`}
      >
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0" />
        <MsalProviderWrapper>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </MsalProviderWrapper>
      </body>
    </html>
  );
}
