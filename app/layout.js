import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import Navbar from "./components/header";
import WebVitalsReporter from "./components/WebVitalsReporter";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "D.J. Sindh Government Science College | Top College in Karachi",
    template: "%s | DJ Science College"
  },
  description: "D.J. Sindh Government Science College (DJ Science College) - A prestigious public college affiliated with the University of Karachi. Offering undergraduate programs with a focus on academic excellence, research, and innovation in science education.",
  keywords: ["colleges in Karachi", "science education Pakistan", "intermediate programs Karachi", "pre-engineering colleges", "pre-medical colleges", "University of Karachi", "top college Karachi", "science college Pakistan"],
  authors: [{ name: "D.J. Sindh Government Science College", url: "http://dj-college.vercel.app" }],
  creator: "D.J. Sindh Government Science College",
  publisher: "D.J. Sindh Government Science College",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://dj-college.vercel.app'),
  openGraph: {
    title: "D.J. Sindh Government Science College | Top College in Karachi",
    description: "A prestigious public college affiliated with the University of Karachi. Offering undergraduate programs with a focus on academic excellence, research, and innovation in science education.",
    url: "http://dj-college.vercel.app",
    siteName: "DJ Science College",
    images: [
      {
        url: "/images/logo.jpg", // Replace with actual logo path
        width: 800,
        height: 600,
        alt: "D.J. Sindh Government Science College Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "D.J. Sindh Government Science College | Top College in Karachi",
    description: "A prestigious public college affiliated with the University of Karachi. Offering undergraduate programs with a focus on academic excellence, research, and innovation in science education.",
    images: ["/images/logo.jpg"], // Replace with actual logo path
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
    yahoo: 'yahoo-site-verification-code',
    yandex: 'yandex-site-verification-code',
  },
  alternates: {
    canonical: 'http://dj-college.vercel.app',
    languages: {
      'en-PK': 'http://dj-college.vercel.app/en',
      'ur-PK': 'http://dj-college.vercel.app/ur',
    },
  },
  other: {
    'hreflang:en-PK': 'http://dj-college.vercel.app/en',
    'hreflang:ur-PK': 'http://dj-college.vercel.app/ur',
    'hreflang:x-default': 'http://dj-college.vercel.app',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebVitalsReporter />
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
