'use client';

import { useEffect, useRef, useState } from 'react';
import { CourseSchema, FAQPageSchema } from '../components/schema';
import { departmentsData } from '../data/admission';

export default function AdmissionPage() {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const departments = departmentsData;

  return (
    <div className="max-w-[1200px] mx-auto p-10 font-['Segoe_UI','Helvetica_Neue',sans-serif] text-[#1a1a1a] bg-[#fafaf9] max-md:p-5">
      {/* Schema markup for the admission page */}
      <CourseSchema
        name="Pre-Engineering Program"
        description="Three-year Bachelor of Science program in pre-engineering fields affiliated with the University of Karachi."
        provider={{
          '@type': 'EducationalOrganization',
          name: 'D.J. Sindh Government Science College',
          sameAs: 'http://dj-college.vercel.app'
        }}
      />
      <CourseSchema
        name="Pre-Medical Program"
        description="Three-year Bachelor of Science program in pre-medical fields affiliated with the University of Karachi."
        provider={{
          '@type': 'EducationalOrganization',
          name: 'D.J. Sindh Government Science College',
          sameAs: 'http://dj-college.vercel.app'
        }}
      />
      <FAQPageSchema 
        mainEntity={[
          {
            '@type': 'Question',
            name: 'What are the admission requirements?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Students must have completed intermediate level education from a recognized board.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do I apply for admission?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Applications are submitted through the Centralized Admission Policy (CAP) system.'
            }
          }
        ]}
      />
      
      <h1 className="text-[36px] font-bold mb-5 text-[#10b981] max-md:text-[28px]">
        Admission
      </h1>

      {/* Info Box */}
      <div
        id="info"
        ref={(el) => (sectionRefs.current['info'] = el)}
        className={`bg-[#e8f5e9] border-l-4 border-[#10b981] p-6 my-10 rounded text-[16px] leading-[1.8] text-[#2c2c2c] transition-all duration-700 ${
          visibleSections['info']
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-5'
        } max-md:text-[14px] max-md:p-4`}
      >
        The college offers the admission in Pre-Engineering and Pre-Medical for Intermediate level
        affiliated to the Board of Intermediate Education, Karachi (B.I.E.K) under CAP (Centralized
        Admission Policy).
      </div>

      {/* Departments */}
      <div className="mt-[60px]">
        <h2 className="text-[28px] font-semibold mb-10 text-center text-[#1a1a1a] max-md:text-[22px]">
          Our Departments
        </h2>

        <div
          id="departments"
          ref={(el) => (sectionRefs.current['departments'] = el)}
          className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-10 max-md:grid-cols-1 max-md:gap-4"
        >
          {departments.map((dept, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-t-[3px] border-[#10b981] transition-all duration-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:-translate-y-1 ${
                Object.values(visibleSections).some((v) => v)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-5'
              }`}
            >
              <h3 className="text-[18px] font-semibold text-[#10b981] mb-3">
                {dept.name}
              </h3>
              <p className="text-[14px] leading-[1.7] text-[#555]">
                {dept.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
