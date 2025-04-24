import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../components/index.css";
import { SessionSyncProvider } from "@/components/session-sync-provider";
import { CartProvider } from "@/context/cart-context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeyWorld Games",
  description: "Juegos indie al alcance de tu mano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#181818]`}>
        <SessionSyncProvider>
          <CartProvider>
            {children}
            <ToastContainer
  position="top-center"
  autoClose={3000}
  aria-label="Notificaciones del sistema"
/>

          </CartProvider>
        </SessionSyncProvider>
      </body>
    </html>
  );
}
