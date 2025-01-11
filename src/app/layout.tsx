import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./main.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repair Spin - Washing Machine Repairs in Minneapolis",
  description: "Fast and professional washing machine repair services in Minneapolis and nearby areas. Call (555) 123-4567 for reliable service!"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Repair Spin - Washing Machine Repairs in Minneapolis</title>
        <meta
          name="description"
          content="Fast and professional washing machine repair services in Minneapolis and nearby areas. Call (555) 123-4567 now!"
        />
        <meta
          name="keywords"
          content="washing machine repair, Minneapolis, Minnesota, Eden Prairie, Bloomington, Plymouth, Shakopee, Richfield, Minnetonka, Medina"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://www.repairspin.com" />
        <meta property="og:title" content="Repair Spin - Washing Machine Repairs" />
        <meta
          property="og:description"
          content="We provide professional washing machine repair services in Minneapolis."
        />
        <meta property="og:image" content="https://www.repairspin.com/images/hero.webp" />
        <meta property="og:url" content="https://www.repairspin.com" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Repair Spin",
            description: "Fast and professional washing machine repair services in Minneapolis and nearby areas.",
            areaServed: [
              "Minnetonka",
              "Woodland",
              "Deephaven",
              "Plymouth",
              "Richfield",
              "Eden Prairie",
              "Bloomington",
              "Shakopee",
              "Golden Valley",
              "Medina",
              "Minneapolis"
            ],
            telephone: "+15551234567",
            url: "https://www.repairspin.com",
            image: "https://www.repairspin.com/images/hero.webp",
            openingHours: "Mo-Fr 08:00-18:00"
          })}
        </script>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
