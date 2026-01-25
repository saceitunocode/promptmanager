import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestor de Prompts",
  description: "Gestiona y organiza tus prompts en carpetas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="overflow-hidden">
        {children}
      </body>
    </html>
  );
}
