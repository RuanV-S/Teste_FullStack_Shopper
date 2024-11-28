import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taxi Plus - Sua Viagem com Conforto e Segurança",
  description:
    "Bem-vindo ao Taxi Plus, o serviço de transporte que vai além das expectativas. Oferecemos viagens rápidas, seguras e confortáveis para você, com motoristas experientes e veículos modernos. Seja para ir ao trabalho, aeroporto, ou um evento especial, o Taxi Plus está sempre à disposição, pronto para levar você ao seu destino com tranquilidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
