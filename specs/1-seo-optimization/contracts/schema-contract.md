# SEO Schema Contract

## Purpose
Defines the structured data schema contracts for the DJ College website to improve search visibility and enable rich snippets.

## Schema Types

### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "D.J. Sindh Government Science College",
  "alternateName": "DJ Science College",
  "url": "http://dj-college.vercel.app",
  "logo": "http://dj-college.vercel.app/images/logo.jpg",
  "description": "A prestigious public college affiliated with the University of Karachi, offering undergraduate programs with a focus on academic excellence, research, and innovation.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "V237+CQ5, Dr Ziauddin Ahmed Rd",
    "addressLocality": "Karachi",
    "addressRegion": "Sindh",
    "postalCode": "",
    "addressCountry": "PK"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+92 21 XXXX XXXX",
    "contactType": "admissions",
    "areaServed": "PK",
    "availableLanguage": ["English", "Urdu"]
  },
  "sameAs": [
    "https://www.facebook.com/DJSindhCollege/",
    "https://pk.linkedin.com/school/d-j-science-college/",
    "https://www.instagram.com/dj_ijt/"
  ],
  "foundingDate": "",
  "alumni": [
    {
      "@type": "Person",
      "name": "Abdul Qadeer Khan",
      "knowsAbout": "Nuclear Science"
    }
  ]
}
```

### Course Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Bachelor of Science in Computer Science",
  "description": "Three-year Bachelor of Computer Science (B.C.S.) semester system programme affiliated with the University of Karachi.",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "D.J. Sindh Government Science College",
    "sameAs": "http://dj-college.vercel.app"
  }
}
```

### Local Business Schema
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "D.J. Sindh Government Science College",
  "image": "http://dj-college.vercel.app/images/campus.jpg",
  "telephone": "+92 21 XXXX XXXX",
  "email": "info@college.edu.pk",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "V237+CQ5, Dr Ziauddin Ahmed Rd",
    "addressLocality": "Karachi",
    "addressRegion": "Sindh",
    "postalCode": "",
    "addressCountry": "PK"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 24.8607,
    "longitude": 67.0011
  },
  "url": "http://dj-college.vercel.app",
  "openingHours": "Mo-Fr 08:00-16:00",
  "areaServed": {
    "@type": "City",
    "name": "Karachi"
  },
  "specialOpeningHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "opens": "08:00",
      "closes": "16:00",
      "validFrom": "2024-01-01",
      "validThrough": "2024-12-31",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
  ]
}
```