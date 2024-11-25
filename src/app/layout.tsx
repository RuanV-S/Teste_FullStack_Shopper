import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopper Táxi - Compras na Pista Certa",
  description:
    "Shopper Táxi é o aplicativo que combina mobilidade e eficiência para conectar passageiros a motoristas de forma rápida e prática. Com uma interface simples e intuitiva, oferecemos uma experiência segura e confiável para suas viagens. Seu transporte, na pista certa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
