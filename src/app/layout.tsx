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
  title: "Pavel's Appliance Repair - Appliance Repair Services in Twin Cities",
  description:
    "Fast and professional repair services for washers, dryers, refrigerators, dishwashers, ovens, and stoves in Minneapolis and nearby areas. Call (555) 123-4567 for reliable service!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Pavel&apos;s Appliance Repair | Reliable Appliance Repair in Twin Cities</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta
          name="description"
          content="Fast and reliable appliance repair services in Twin Cities and nearby areas. We fix washers, dryers, refrigerators, ovens, and dishwashers. Call (555) 123-4567 today!"
        />
        <meta
          name="keywords"
          content="appliance repair, washer repair, dryer repair, refrigerator repair, oven repair, dishwasher repair, Minneapolis, Minnesota"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://www.pavelsappliancerepair.com" />
        <meta property="og:title" content="Pavel&apos;s Appliance Repair | Reliable Appliance Repair in Twin Cities" />
        <meta
          property="og:description"
          content="We provide fast and affordable appliance repair services in Twin Cities and nearby areas. Call us for professional service!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.pavelsappliancerepair.com/img/hero.webp" />
        <meta property="og:url" content="https://www.pavelsappliancerepair.com" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Pavel's Appliance Repair",
            description: "Fast and professional repair services for washers, dryers, refrigerators, dishwashers, ovens, and stoves in Minneapolis and nearby areas. Call (555) 123-4567 for reliable service!",
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
