import type { Metadata, Viewport } from "next";

import { AppSidebar, MobileNavigation } from "@/components/app-sidebar";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

import "./globals.css";

export const metadata: Metadata = {
  title: "Wang Bang",
  description: "Wang Bang web application",
  applicationName: "Wang Bang",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wang Bang",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-background text-foreground min-h-screen font-sans antialiased">
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="min-w-0 flex-1 pb-16 md:pb-0">
            <MobileNavigation />
            {children}
          </div>
        </div>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
