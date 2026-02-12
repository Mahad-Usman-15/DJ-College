// Home page with metadata
import { CollegePageClient } from './page-client';

// Metadata for the home page
export const metadata = {
  title: "D.J. Sindh Government Science College | Top College in Karachi",
  description: "Discover D.J. Sindh Government Science College (DJ Science College), a prestigious public college in Karachi affiliated with the University of Karachi. Offering undergraduate programs in science, pre-engineering, and pre-medical fields with a focus on academic excellence.",
  keywords: ["colleges in Karachi", "science education Pakistan", "intermediate programs Karachi", "pre-engineering colleges", "pre-medical colleges", "University of Karachi", "top college Karachi", "science college Pakistan", "DJ Science College"],
  openGraph: {
    title: "D.J. Sindh Government Science College | Top College in Karachi",
    description: "Discover D.J. Sindh Government Science College (DJ Science College), a prestigious public college in Karachi affiliated with the University of Karachi. Offering undergraduate programs in science, pre-engineering, and pre-medical fields with a focus on academic excellence.",
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
    description: "Discover D.J. Sindh Government Science College (DJ Science College), a prestigious public college in Karachi affiliated with the University of Karachi. Offering undergraduate programs in science, pre-engineering, and pre-medical fields with a focus on academic excellence.",
    images: ["/images/logo.jpg"], // Replace with actual logo path
  },
  alternates: {
    canonical: 'http://dj-college.vercel.app/',
  },
};

export default function HomePage() {
  return <CollegePageClient />;
}