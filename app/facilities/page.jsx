'use client';

import { useEffect, useState } from 'react';
import { LocalBusinessSchema, FAQPageSchema } from '../components/schema';
import { facilitiesInfoData } from '../data/facilities';

const FacilitiesPage = () => {
  const [visibleItems, setVisibleItems] = useState({});

  const facilities = facilitiesInfoData;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id');
          setVisibleItems((prev) => ({ ...prev, [id]: true }));
        }
      });
    });

    const elements = document.querySelectorAll('[data-id]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#f8f7f4] min-h-screen px-5 py-10 sm:px-5">
      {/* Schema markup for the facilities page */}
      <LocalBusinessSchema 
        name="D.J. Sindh Government Science College Facilities"
        image="/images/campus-facilities.jpg"
        telephone="+92 21 XXXX XXXX"
        email="info@college.edu.pk"
        address={{
          '@type': 'PostalAddress',
          streetAddress: 'V237+CQ5, Dr Ziauddin Ahmed Rd',
          addressLocality: 'Karachi',
          addressRegion: 'Sindh',
          postalCode: '',
          addressCountry: 'PK'
        }}
        geo={{
          '@type': 'GeoCoordinates',
          latitude: 24.8607,
          longitude: 67.0011
        }}
        url="http://dj-college.vercel.app"
        openingHours="Mo-Fr 08:00-16:00"
        areaServed={{
          '@type': 'City',
          name: 'Karachi'
        }}
      />
      <FAQPageSchema 
        mainEntity={[
          {
            '@type': 'Question',
            name: 'What facilities are available at the college?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The college offers state-of-the-art facilities including science labs, libraries, computer labs, gymnasium, auditorium, and more.'
            }
          },
          {
            '@type': 'Question',
            name: 'Are the laboratories well-equipped?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, our laboratories are equipped with advanced equipment for Physics, Chemistry, and Biology experiments.'
            }
          }
        ]}
      />
      
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[60px] py-10 max-[480px]:mb-10 max-[480px]:py-5">
          <h1 className="text-[3.5rem] font-bold tracking-[-1px] text-[#2c5f2d] max-md:text-[2.5rem] max-[480px]:text-[2rem]">
            Our Facilities
          </h1>
          <p className="text-[1.1rem] text-[#555] max-w-[600px] mx-auto leading-[1.6] max-md:text-[1rem] max-[480px]:text-[0.95rem]">
            Explore the world-class facilities and infrastructure that support academic excellence and student
            development at our institution.
          </p>
        </div>

        {/* Items */}
        {facilities.map((facility) => (
          <div
            key={facility.id}
            data-id={facility.id}
            className={`mb-[50px] transform transition-all duration-[800ms] ease-out ${
              visibleItems[facility.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
            }`}
          >
            <div className="bg-gradient-to-br from-[#2c5f2d] to-[#1a3a1b] text-white py-[80px] px-10 rounded-xl text-center shadow-[0_10px_40px_rgba(44,95,45,0.2)] max-md:py-[50px] max-md:px-[25px] max-[480px]:py-[40px] max-[480px]:px-5">
              <h2 className="text-[2.8rem] font-bold tracking-[-0.5px] mb-5 max-md:text-[2rem] max-[480px]:text-[1.6rem]">
                {facility.name}
              </h2>
              <p className="text-[1rem] leading-[1.8] max-w-[800px] mx-auto text-white/95 max-md:text-[0.95rem] max-[480px]:text-[0.9rem]">
                {facility.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesPage;
