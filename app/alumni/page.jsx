'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { EducationalOrganizationSchema, FAQPageSchema } from '../components/schema';
import { alumniData } from '../data/alumni';
export default function AlumniPage() {
    const [visibleSections, setVisibleSections] = useState({});
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }));
                    }
                });
            },
            { threshold: 0.2 }
        );

        const sections = document.querySelectorAll('[data-observable="true"]');
        sections.forEach((section) => {
            observerRef.current.observe(section);
        });

        return () => {
            sections.forEach((section) => {
                observerRef.current.unobserve(section);
            });
        };
    }, []);

    const alumni = alumniData;

    return (
        <div>
            {/* Schema markup for the alumni page */}
            <EducationalOrganizationSchema 
              name="D.J. Sindh Government Science College"
              description="A prestigious public college affiliated with the University of Karachi, known for producing distinguished alumni in various fields."
              url="http://dj-college.vercel.app"
              address={{
                '@type': 'PostalAddress',
                streetAddress: 'V237+CQ5, Dr Ziauddin Ahmed Rd',
                addressLocality: 'Karachi',
                addressRegion: 'Sindh',
                postalCode: '',
                addressCountry: 'PK'
              }}
              areaServed="Karachi"
              alumni={[
                {
                  '@type': 'Person',
                  name: 'Abdul Qadeer Khan',
                  knowsAbout: 'Nuclear Science'
                },
                {
                  '@type': 'Person',
                  name: 'Ziaur Rahman',
                  knowsAbout: 'Politics'
                },
                {
                  '@type': 'Person',
                  name: 'Ashraf Habibullah',
                  knowsAbout: 'Technology'
                },
                {
                  '@type': 'Person',
                  name: 'Pirzada Qasim',
                  knowsAbout: 'Education'
                },
                {
                  '@type': 'Person',
                  name: 'Adeebul Hasan Rizvi',
                  knowsAbout: 'Medicine'
                }
              ]}
            />
            <FAQPageSchema 
              mainEntity={[
                {
                  '@type': 'Question',
                  name: 'Who are some notable alumni of the college?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Notable alumni include Abdul Qadeer Khan, Ziaur Rahman, Ashraf Habibullah, Pirzada Qasim, and Adeebul Hasan Rizvi.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'What fields have alumni excelled in?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Our alumni have excelled in fields such as science, politics, technology, education, and medicine.'
                  }
                }
              ]}
            />
            
            {/* Header */}
            <header className="bg-[linear-gradient(135deg,#ffffff_0%,#f0ede6_100%)] px-5 py-[60px] text-center border-b-[3px] border-[#2d7a4a] mb-[60px]">
                <h1 className="text-[clamp(28px,5vw,48px)] text-[#1a1a1a] mb-4 font-bold tracking-[-0.5px]">
                    Distinguished Alumni
                </h1>
                <p className="text-[clamp(14px,2vw,18px)] text-[#2d7a4a] font-medium max-w-[600px] mx-auto">
                    Celebrating the remarkable achievements and lasting legacies of our college community
                </p>
            </header>

            <main className="w-full mx-auto">
                {alumni.map((person, index) => {
                    const isVisible = visibleSections[person.id];

                    return (
                        <section
                            key={person.id}
                            id={person.id}
                            data-observable="true"
                            className={`
    flex items-center min-h-[420px]
    ${person.imagePosition === 'left' ? 'flex-row' : 'flex-row-reverse'}
    max-md:flex-col
    transition-all duration-[800ms]
  `}
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible
                                    ? 'translateY(0)'
                                    : `translateY(${person.imagePosition === 'left' ? '40px' : '-40px'})`,
                                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        >

                            {/* Image Side */}

                            <div className="
  relative flex-1 overflow-hidden
  min-h-[400px]
  max-md:min-h-0
  max-md:w-full
  max-md:aspect-[4/3]
">
                                <Image
                                    src={person.image}
                                    alt={person.name}
                                    fill
                                    sizes="(max-width:768px) 100vw, 50vw"
                                    className="object-cover"
                                    priority={index === 0}
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(45,122,74,0.15)_0%,rgba(255,255,255,0.05)_100%)]" />
                            </div>


                            {/* Content Side */}
                            <div
                                className={`
                  flex-1 bg-[#fefdfb] flex flex-col justify-center
                  p-[clamp(40px,6vw,60px)]
                  max-[480px]:px-5 max-[480px]:py-[30px]
                  ${person.imagePosition === 'left'
                                        ? 'border-l-[5px] border-[#2d7a4a]'
                                        : 'border-r-[5px] border-[#2d7a4a]'}
                  max-md:border-l-0 max-md:border-r-0 max-md:border-t-[5px] max-md:border-[#2d7a4a]
                `}
                            >
                                <div className="mb-6">
                                    <p className="text-[13px] font-bold tracking-[2px] text-[#2d7a4a] uppercase mb-3">
                                        Alumni {index + 1} of {alumni.length}
                                    </p>

                                    <h2 className="text-[clamp(24px,4vw,42px)] text-[#1a1a1a] mb-3 font-bold leading-[1.2]">
                                        {person.name}
                                    </h2>

                                    <h3 className="text-[clamp(14px,2.5vw,20px)] text-[#2d7a4a] font-semibold mb-6 leading-[1.4]">
                                        {person.title}
                                    </h3>
                                </div>

                                <div className="w-[60px] h-[4px] bg-[#2d7a4a] mb-6 rounded-[2px]" />

                                <p className="text-[clamp(13px,2vw,16px)] text-[#4a4a4a] leading-[1.7] font-normal">
                                    {person.description}
                                </p>
                            </div>
                        </section>
                    );
                })}
            </main>
        </div>
    );
}
