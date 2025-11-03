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
  title: "Nguyen Hoang Tuan - Fullstack Developer",
  description:
    "Fullstack Developer with experience in building high-performance, user-centric applications using React, Next.js, Node.js and NestJS. Specializes in TypeScript, scalable architecture and integrations.",
  keywords: [
    "Nguyen Hoang Tuan",
    "Fullstack Developer",
    "React",
    "Next.js",
    "Node.js",
    "NestJS",
    "TypeScript",
    "JavaScript",
    "MySQL",
    "MongoDB",
    "Kubernetes",
  ],
  authors: [{ name: "Nguyen Hoang Tuan", url: "https://www.tuannguyenhoang.com" }],
  creator: "Nguyen Hoang Tuan",
  publisher: "Nguyen Hoang Tuan",
  metadataBase: new URL("https://www.tuannguyenhoang.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.tuannguyenhoang.com",
    title: "Nguyen Hoang Tuan - Fullstack Developer",
    description:
      "Fullstack Developer specialized in React, Next.js, Node.js and NestJS. Building scalable, high-performance web applications.",
    siteName: "Nguyen Hoang Tuan - Resume",
    images: [
      {
        url: "https://res.cloudinary.com/dxc0m9waq/image/upload/v1646512308/metatag_ftkcdv.jpg",
        width: 1200,
        height: 630,
        alt: "Nguyen Hoang Tuan - Fullstack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyen Hoang Tuan - Fullstack Developer",
    description:
      "Fullstack Developer specialized in React, Next.js, Node.js and NestJS. Building scalable, high-performance web applications.",
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
    email: "nguyenhoangtuan110699@gmail.com",
    url: "https://www.tuannguyenhoang.com",
    image: "https://res.cloudinary.com/dxc0m9waq/image/upload/v1646512308/metatag_ftkcdv.jpg",
    jobTitle: "Fullstack Developer",
    description:
      "Fullstack Developer with experience in React, Next.js, Node.js and NestJS. Focused on performance, scalability and maintainable code.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ho Chi Minh City",
      addressCountry: "Vietnam",
    },
    sameAs: [
      "https://www.linkedin.com/in/hoangtuan99",
      "https://www.facebook.com/nguyen.hoang.tuan.218850",
      "https://www.tuannguyenhoang.com",
    ],
    worksFor: {
      "@type": "Organization",
      name: "TRAVEL EASY",
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
      "MySQL",
      "MongoDB",
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
