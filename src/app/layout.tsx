import type { Metadata } from "next";
import { Playfair_Display, Parisienne } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Pour Toi, Roxane",
  description: "Un cadeau du coeur, fait avec amour.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💖</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${parisienne.variable} antialiased`}
        style={{
          background: '#0d0508',
          color: 'rgba(255, 200, 210, 0.9)',
          overflowX: 'hidden',
        }}
      >
        {children}
      </body>
    </html>
  );
}