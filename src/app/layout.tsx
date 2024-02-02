"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient()
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <QueryClientProvider client={queryClient}>
        <body className={inter.className} suppressHydrationWarning={true}>{children}</body>
      </QueryClientProvider>
    </html>
  );
}
