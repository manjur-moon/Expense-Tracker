import type { Metadata } from "next";

import StoreProvider from "@/redux/StoreProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track and manage daily expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}