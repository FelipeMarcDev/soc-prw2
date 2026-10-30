import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOC - Gestão de Incidentes",
  description: "Gestão de Incidentes de Segurança da Informação",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
