
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import {ClerkProvider} from "@clerk/nextjs";
import { Toaster } from "sonner";


const inter = Inter({subsets: ["latin"]});
export const metadata = {
  title: "Dream Toyz ",
  description: "Find your dream vehicle",
};

export default function RootLayout({ children }) {
  const isDarkMode = false; // Replace with your dark mode logic

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} antialiased ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}
        >
          <Header />

          {/* Main grows and pushes footer down */}
          <main className="flex-1 w-full min-h-screen ">
            {children}
          </main>

          <Toaster richColors />

          <footer className="w-full py-4 text-center bg-gray-800 text-white">
            <div className="container mx-auto">
              Made with ❤️ by Akshit Arora
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}

