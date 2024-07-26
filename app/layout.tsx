import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { AuthProvider } from "./provider/auth_provider";
import ToastProvider from "./provider/toast_provider";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Jeta",
  description: "JETA - Jepara E Transport Application",
  authors: [
    {
      name: "Reihan Saputra",
      url: "https://jeta-app.com",
    },
  ],
  icons: {
    icon: "/Logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Logo.svg" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={poppins.className}>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
