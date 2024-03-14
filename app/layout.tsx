import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Provider from "@/components/Provider";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import HolyLoader from "holy-loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skill Space",
  description: "Learn without limits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body
          className={`${inter.className} min-h-screen h-full flex flex-col w-full max-w-7xl mx-auto p-5`}
        >
          <Navbar />

          <main className="flex-1 ">
            <HolyLoader />

            {children}
          </main>
          <Footer />
          <Toaster />
        </body>
      </Provider>
    </html>
  );
}
