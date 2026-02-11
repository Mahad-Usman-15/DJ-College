'use client';

import { useEffect, useRef, useState } from 'react';

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

  const departments = [
    {
      name: 'Biochemistry',
      description:
        "Study the chemical processes within living organisms. Biochemistry explores the molecular basis of life, including enzyme mechanisms, metabolic pathways, and cellular chemistry. Essential for understanding biological systems and disease mechanisms.",
    },
    {
      name: 'Botany',
      description:
        'Explore the diversity and structure of plants and their ecosystems. Botany covers plant taxonomy, physiology, ecology, and evolution. Students learn about plant adaptation, reproduction, and their crucial role in the environment.',
    },
    {
      name: 'Chemistry',
      description:
        'Master the science of matter, reactions, and transformations. Chemistry encompasses organic, inorganic, and physical chemistry. Develop practical laboratory skills and theoretical knowledge essential for advanced sciences and technology.',
    },
    {
      name: 'English',
      description:
        'Develop advanced communication and analytical skills through literature and composition. Study English language, writing techniques, critical analysis, and literary traditions. Enhance your ability to express ideas effectively in written and spoken form.',
    },
    {
      name: 'Geology',
      description:
        "Understand Earth's structure, composition, and dynamic processes. Geology covers mineral science, rock formation, plate tectonics, and natural resource exploration. Learn about Earth's history and environmental geology.",
    },
    {
      name: 'Islamic Studies',
      description:
        'Gain comprehensive knowledge of Islamic teachings, history, and jurisprudence. Islamic Studies covers Quranic sciences, Hadith, Islamic law, and civilization. Develop understanding of Islamic principles and their contemporary applications.',
    },
    {
      name: 'Computer Science',
      description:
        'Learn programming, algorithms, and computational thinking. Computer Science covers programming languages, data structures, software development, and computational problem-solving. Prepare for careers in technology and software engineering.',
    },
    {
      name: 'Mathematics',
      description:
        'Master mathematical concepts from algebra to calculus and beyond. Mathematics develops logical reasoning and problem-solving abilities. Essential foundation for engineering, sciences, and advanced technical fields.',
    },
    {
      name: 'Microbiology',
      description:
        'Study microscopic organisms and their impact on health and industry. Microbiology covers bacteria, viruses, fungi, and their applications in medicine and biotechnology. Understand disease mechanisms and antimicrobial strategies.',
    },
    {
      name: 'Pakistan Studies',
      description:
        "Explore the history, culture, and geography of Pakistan. Pakistan Studies covers the nation's political development, geographical features, cultural heritage, and contemporary issues. Develop national consciousness and civic awareness.",
    },
    {
      name: 'Physical Education and Sports',
      description:
        'Develop fitness, athletic skills, and sports knowledge. Physical Education encompasses exercise physiology, sports science, and athletic training. Promote healthy lifestyles and competitive excellence.',
    },
    {
      name: 'Physics',
      description:
        'Understand the fundamental laws governing matter and energy. Physics covers mechanics, electricity, magnetism, optics, and modern physics. Develop analytical skills essential for engineering and technology.',
    },
    {
      name: 'Sindhi',
      description:
        'Study the Sindhi language, literature, and cultural heritage. Sindhi language classes develop linguistic proficiency and literary appreciation. Connect with regional culture and linguistic traditions.',
    },
    {
      name: 'Statistics',
      description:
        'Learn data analysis, probability, and statistical methods. Statistics covers data collection, analysis, inference, and interpretation. Essential for research, business, and scientific applications.',
    },
    {
      name: 'Urdu',
      description:
        'Master Urdu language, grammar, and classical literature. Urdu studies develop language skills and literary appreciation. Explore the rich heritage of Urdu poetry, prose, and intellectual traditions.',
    },
    {
      name: 'Zoology',
      description:
        'Explore animal biology, behavior, and diversity. Zoology covers animal classification, anatomy, physiology, and ecology. Understand animal adaptation, evolution, and conservation biology.',
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-10 font-['Segoe_UI','Helvetica_Neue',sans-serif] text-[#1a1a1a] bg-[#fafaf9] max-md:p-5">
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
