'use client';

import { useEffect } from 'react';

const SchemaMarkup = ({ data }) => {
  useEffect(() => {
    // This component adds JSON-LD schema markup to the page
  }, [data]);

  return (
    <>
      {data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      )}
    </>
  );
};

// Export specific schema components for different types
export const OrganizationSchema = ({ 
  name, 
  description, 
  url, 
  logo, 
  address, 
  contactPoint,
  sameAs 
}) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name || 'D.J. Sindh Government Science College',
    alternateName: 'DJ Science College',
    url: url || 'http://dj-college.vercel.app',
    logo: logo || 'http://dj-college.vercel.app/images/logo.jpg',
    description: description || 'A prestigious public college affiliated with the University of Karachi, offering undergraduate programs with a focus on academic excellence, research, and innovation.',
    address: address || {
      '@type': 'PostalAddress',
      streetAddress: 'V237+CQ5, Dr Ziauddin Ahmed Rd',
      addressLocality: 'Karachi',
      addressRegion: 'Sindh',
      postalCode: '',
      addressCountry: 'PK'
    },
    contactPoint: contactPoint || {
      '@type': 'ContactPoint',
      telephone: '+92 21 XXXX XXXX',
      contactType: 'admissions',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu']
    },
    sameAs: sameAs || [
      'https://www.facebook.com/DJSindhCollege/',
      'https://pk.linkedin.com/school/d-j-science-college/',
      'https://www.instagram.com/dj_ijt/'
    ]
  };

  return <SchemaMarkup data={schemaData} />;
};

export const EducationalOrganizationSchema = ({
  name,
  description,
  url,
  address,
  areaServed,
  alumni
}) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: name || 'D.J. Sindh Government Science College',
    alternateName: 'DJ Science College',
    url: url || 'http://dj-college.vercel.app',
    description: description || 'A prestigious public college affiliated with the University of Karachi, offering undergraduate programs with a focus on academic excellence, research, and innovation.',
    address: address || {
      '@type': 'PostalAddress',
      streetAddress: 'V237+CQ5, Dr Ziauddin Ahmed Rd',
      addressLocality: 'Karachi',
      addressRegion: 'Sindh',
      postalCode: '',
      addressCountry: 'PK'
    },
    areaServed: areaServed || 'Karachi',
    ...(alumni && { alumni })
  };

  return <SchemaMarkup data={schemaData} />;
};

export const LocalBusinessSchema = ({ 
  name, 
  image, 
  telephone, 
  email, 
  address, 
  geo,
  url,
  openingHours,
  areaServed 
}) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization', // Using EducationalOrganization as it's more specific than LocalBusiness for a college
    name: name || 'D.J. Sindh Government Science College',
    image: image || 'http://dj-college.vercel.app/images/campus.jpg',
    telephone: telephone || '+92 21 XXXX XXXX',
    email: email || 'info@college.edu.pk',
    address: address || {
      '@type': 'PostalAddress',
      streetAddress: 'V237+CQ5, Dr Ziauddin Ahmed Rd',
      addressLocality: 'Karachi',
      addressRegion: 'Sindh',
      postalCode: '',
      addressCountry: 'PK'
    },
    geo: geo || {
      '@type': 'GeoCoordinates',
      latitude: 24.8607,
      longitude: 67.0011
    },
    url: url || 'http://dj-college.vercel.app',
    openingHours: openingHours || 'Mo-Fr 08:00-16:00',
    areaServed: areaServed || {
      '@type': 'City',
      name: 'Karachi'
    }
  };

  return <SchemaMarkup data={schemaData} />;
};

export const CourseSchema = ({ name, description, provider }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: name || 'Bachelor of Science in Computer Science',
    description: description || 'Three-year Bachelor of Computer Science (B.C.S.) semester system programme affiliated with the University of Karachi.',
    provider: provider || {
      '@type': 'EducationalOrganization',
      name: 'D.J. Sindh Government Science College',
      sameAs: 'http://dj-college.vercel.app'
    }
  };

  return <SchemaMarkup data={schemaData} />;
};

export const BreadcrumbSchema = ({ breadcrumbs }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs?.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.item
    })) || []
  };

  return <SchemaMarkup data={schemaData} />;
};

export const FAQPageSchema = ({ mainEntity }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mainEntity || []
  };

  return <SchemaMarkup data={schemaData} />;
};

export default SchemaMarkup;