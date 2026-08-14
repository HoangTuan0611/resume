import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nguyen Hoang Tuan - Full-Stack, Data Engineer",
  description:
    "Full-Stack, Data Engineer building scalable products, real-time data pipelines, and backend services with Go, Python, PostgreSQL, PostGIS, ClickHouse, Kafka, and TypeScript.",
  keywords: [
    "Nguyen Hoang Tuan",
    "Full-Stack Engineer",
    "Data Engineer",
    "Data Platform",
    "React",
    "Next.js",
    "Node.js",
    "NestJS",
    "Go",
    "Python",
    "TypeScript",
    "JavaScript",
    "PostgreSQL",
    "PostGIS",
    "MongoDB",
    "ClickHouse",
    "Kafka",
    "Kubernetes",
  ],
  authors: [{ name: "Nguyen Hoang Tuan", url: "https://hoangtuan.me" }],
  creator: "Nguyen Hoang Tuan",
  publisher: "Nguyen Hoang Tuan",
  metadataBase: new URL("https://hoangtuan.me"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hoangtuan.me",
    title: "Nguyen Hoang Tuan - Full-Stack, Data Engineer",
    description:
      "Full-Stack, Data Engineer specialized in scalable products, real-time data pipelines, and backend services.",
    siteName: "Nguyen Hoang Tuan - Resume",
    images: [
      {
        url: "https://res.cloudinary.com/dxc0m9waq/image/upload/v1646512308/metatag_ftkcdv.jpg",
        width: 1200,
        height: 630,
        alt: "Nguyen Hoang Tuan - Full-Stack, Data Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyen Hoang Tuan - Full-Stack, Data Engineer",
    description:
      "Full-Stack, Data Engineer specialized in scalable products, real-time data pipelines, and backend services.",
    images: ["https://res.cloudinary.com/dxc0m9waq/image/upload/v1646512308/metatag_ftkcdv.jpg"],
    creator: "@nguyenhoangtuan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    other: [
      {
        rel: "icon",
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nguyen Hoang Tuan",
    alternateName: "Hoang Tuan",
    givenName: "Nguyen Hoang",
    familyName: "Tuan",
    birthDate: "1999",
    url: "https://hoangtuan.me",
    image: "https://res.cloudinary.com/dxc0m9waq/image/upload/v1646512308/metatag_ftkcdv.jpg",
    jobTitle: "Full-Stack, Data Engineer",
    description:
      "Full-Stack, Data Engineer with experience in scalable products, real-time data pipelines, backend services, and map infrastructure.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ho Chi Minh City",
      addressCountry: "Vietnam",
    },
    sameAs: [
      "https://www.linkedin.com/in/hoangtuan99",
      "https://hoangtuan.me",
    ],
    worksFor: {
      "@type": "Organization",
      name: "bTaskee",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "VNU-HCM University of Information Technology",
      url: "https://www.uit.edu.vn/",
    },
    knowsAbout: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Node.js",
      "NestJS",
      "Go",
      "Python",
      "PostgreSQL",
      "PostGIS",
      "MongoDB",
      "ClickHouse",
      "Kafka",
      "Kubernetes",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
