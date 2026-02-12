'use client';

import { useEffect, useState } from 'react';
import { LocalBusinessSchema, FAQPageSchema } from '../components/schema';

const FacilitiesPage = () => {
  const [visibleItems, setVisibleItems] = useState({});

  const facilities = [
    {
      id: 1,
      name: 'AQ Khan Library',
      description:
        'The AQ Khan Library is the intellectual heart of our college, housing an extensive collection of academic texts, research journals, and digital resources. Our modern library facilities include comfortable reading areas, computer terminals for online research, and a dedicated quiet study zone. With over 50,000 volumes and subscriptions to major academic databases, students have access to comprehensive learning materials that support their academic pursuits and foster a culture of reading and research.',
    },
    {
      id: 2,
      name: 'Gymnasium',
      description:
        'Our state-of-the-art gymnasium is equipped with modern fitness equipment and provides a healthy environment for student wellness. The facility includes cardio machines, free weights, resistance training equipment, and yoga studios. Our trained instructors conduct regular fitness programs and wellness workshops. The gymnasium serves as a vital space for students to maintain their physical health and build discipline through regular exercise and sports training.',
    },
    {
      id: 3,
      name: 'Biology Lab',
      description:
        'The Biology Laboratory is equipped with advanced microscopes, incubators, autoclaves, and specimen preservation facilities. Students conduct practical experiments in cellular biology, genetics, botany, and zoology. Our lab technicians ensure proper maintenance of equipment and adherence to safety protocols. The facility enables students to gain hands-on experience and develop critical observation and analytical skills essential for biological sciences.',
    },
    {
      id: 4,
      name: 'Physics Lab',
      description:
        'The Physics Laboratory features comprehensive equipment for mechanics, optics, electricity, magnetism, and modern physics experiments. Students work with precision instruments including spectrophotometers, oscilloscopes, and various measuring devices. Well-documented lab manuals guide practical experiments that reinforce theoretical concepts. This facility allows students to verify scientific principles and develop experimental methodology crucial for engineering and physics pursuits.',
    },
    {
      id: 5,
      name: 'Chemistry Lab',
      description:
        'Our Chemistry Laboratory is a well-ventilated facility with fume hoods, distillation apparatus, and comprehensive chemical analysis equipment. Students perform qualitative and quantitative analyses, organic synthesis, and preparation of solutions. Safety equipment including fire extinguishers, eyewash stations, and protective gear ensure secure experimentation. The lab provides hands-on experience in chemical reactions, compound identification, and laboratory techniques essential for chemistry mastery.',
    },
    {
      id: 6,
      name: 'Computer Lab',
      description:
        'The Computer Laboratory houses modern workstations with latest software and high-speed internet connectivity. Students gain practical programming experience in C++, Python, Java, and web development. The lab includes networking equipment for learning system administration and data communication. With both individual workstations and collaborative spaces, students develop technical skills and problem-solving abilities essential for computer science and IT fields.',
    },
    {
      id: 7,
      name: 'Canteen',
      description:
        'The college canteen is a vibrant social hub providing affordable and nutritious meals prepared under hygienic conditions. Our canteen offers a diverse menu including local and international cuisine, catering to various dietary preferences. With spacious seating areas and a warm atmosphere, it serves as a gathering place where students can relax, socialize, and recharge during breaks. The facility ensures food safety compliance and maintains cleanliness standards.',
    },
    {
      id: 8,
      name: 'Book Shop',
      description:
        'The college book shop stocks all required textbooks, reference materials, and stationery supplies for academic programs. Our knowledgeable staff assists students in finding relevant publications and educational resources. The shop also carries competitive pricing and maintains inventory for all disciplines offered at the college. Beyond academics, it offers general reading materials, exam preparation guides, and productivity tools to support student success.',
    },
    {
      id: 9,
      name: 'Auditorium',
      description:
        'The auditorium is a state-of-the-art venue hosting seminars, lectures, cultural events, and academic presentations. Equipped with modern audio-visual systems, comfortable seating for 500+ attendees, and professional lighting, it provides an inspiring environment for intellectual discourse. The facility accommodates guest speakers, workshops, and student performances. Its flexible configuration makes it ideal for both formal academic events and cultural celebrations that enrich campus life.',
    },
  ];

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
