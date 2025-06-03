import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";





const inter = Inter({ weight: ["300", "400", "700"], subsets: ["latin"] });
export const metadata: Metadata = {
  title: "chess",
  description: "play chess online with friends - free games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark antialiased`}>
        <Toaster/>
    
            {children}
          
      </body>
    </html>
  );
}
