import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Vendio | ERP e E-commerce Unificados para Pequenos Negócios",
  description:
    "Centralize vendas, estoque e finanças em um único sistema simples e intuitivo. Acabe com o caos das planilhas e venda mais com a Vendio.",
  keywords: [
    "ERP para pequenos negócios",
    "E-commerce integrado",
    "Gestão de estoque",
    "Controle financeiro",
    "PDV",
    "Vendio",
  ],
  authors: [{ name: "Vendio Technologies" }],
  openGraph: {
    title: "Vendio | ERP e E-commerce Unificados",
    description:
      "A gestão do seu negócio físico e digital em um só lugar. Simples, rápido e intuitivo.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={plusJakartaSans.variable}>
      <body>{children}</body>
    </html>
  );
}
