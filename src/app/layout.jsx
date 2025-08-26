import "@/app/utils/globals.css";

export const metadata = {
  title: "Floricultura Flor de Mandacaru",
  description: "Tipos de flores, cestas e buquês",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
