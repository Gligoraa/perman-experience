import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://perman-experience.vercel.app"),
  title: "Perman Experience | Frizerski salon Rijeka - Online rezervacija",
  description:
    "Perman Experience je premium frizerski salon u Rijeci. Rezervirajte termin online brzo i jednostavno. \u0160i\u0161anje, brijanje i styling na jednom mjestu.",
  keywords:
    "frizer Rijeka, frizerski salon Rijeka, rezervacija frizera online, brijanje Rijeka, Perman Experience, mu\u0161ki frizer Rijeka",
  authors: [{ name: "Perman Experience" }],
  openGraph: {
    type: "website",
    locale: "hr_HR",
    url: "https://perman-experience.vercel.app",
    siteName: "Perman Experience Rijeka",
    title: "Perman Experience | Premium frizerski salon Rijeka",
    description:
      "Rezervirajte termin u salonu Perman Experience u Rijeci. Brzo, jednostavno i online.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perman Experience Rijeka",
    description: "Premium frizerski salon u Rijeci - online rezervacije.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className="custom-scrollbar">
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
