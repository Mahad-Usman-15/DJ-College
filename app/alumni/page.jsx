'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { EducationalOrganizationSchema, FAQPageSchema } from '../components/schema';
import alumni1 from "../../images/abdulqadeer.webp"
import alumni2 from "../../images/ziarehman.jpg"
import alumni3 from "../../images/ashrAF.jpg"
import alumni4 from "../../images/PIRZADA.webp"
import alumni5 from "../../images/adeeb.jpg"
import alumni6 from "../../images/shahidmassor.webp"
import alumni7 from "../../images/kamranashraf.jpg"
import alumni8 from "../../images/ShahidAli.jpg"
import alumni9 from "../../images/Sohairana.jpg"
import alumni10 from "../../images/murad.jpg"
import alumni11 from "../../images/Ghulam Hussain Hidayatullah.jpg"
import alumni12 from "../../images/M.-Kundnani.jpg"
import alumni13 from "../../images/Dolarrai_Mankad.jpg"
import alumni14 from "../../images/moiz.jpg"
import alumni15 from "../../images/jamshed nusserwanji mehta.jpg"
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

    const alumni = [
        {
            id: 'abdul-qadeer',
            name: 'Abdul Qadeer Khan',
            title: 'Nuclear Scientist & Head of Pakistan Nuclear Weapons Program',
            image: alumni1,
            description:
                'A pioneering nuclear scientist whose groundbreaking work revolutionized Pakistan\'s scientific capabilities. Dr. Khan\'s visionary leadership and technical expertise established critical foundations in nuclear science, earning international recognition and shaping the nation\'s strategic development.',
            imagePosition: 'left',
        },
        {
            id: 'ziaur-rahman',
            name: 'Ziaur Rahman',
            title: 'Former President of Bangladesh',
            image: alumni2,
            description:
                'A visionary statesman who guided Bangladesh through pivotal moments in the nation\'s history. His leadership transformed institutional frameworks and fostered national development, leaving an enduring legacy of governance excellence and patriotic service.',
            imagePosition: 'right',
        },
        {
            id: 'ashraf-habibullah',
            name: 'Ashraf Habibullah',
            title: 'President and CEO of Computers and Structures, Inc.',
            image: alumni3,
            description:
                'A technology innovator who established and led one of the world\'s premier software engineering firms. Through strategic vision and technical excellence, he built a global enterprise that revolutionized structural analysis and design technology worldwide.',
            imagePosition: 'left',
        },
        {
            id: 'pirzada-qasim',
            name: 'Pirzada Qasim',
            title: 'Ex Vice-Chancellor, University of Karachi & Ziauddin University',
            image: alumni4,
            description:
                'An eminent academic leader whose contributions shaped higher education in Pakistan. As Vice-Chancellor of two prestigious institutions, Dr. Qasim elevated academic standards, advanced research initiatives, and established the foundation for institutional excellence.',
            imagePosition: 'right',
        },
        {
            id: 'adeebul-hasan',
            name: 'Adeebul Hasan Rizvi',
            title: 'Founder of Sindh Institute of Urology & Transplantation (SIUT)',
            image: alumni5,
            description:
                'A humanitarian medical pioneer who established SIUT, transforming healthcare delivery across South Asia. Dr. Rizvi\'s commitment to advancing transplantation medicine and providing world-class treatment to underserved communities exemplifies profound humanitarian impact.',
            imagePosition: 'left',
        },
        {
            id: 'shahid-masood',
            name: 'Shahid Masood',
            title: 'Journalist and TV Anchor Person',
            image: alumni6,
            description:
                'A distinguished media personality whose investigative journalism and dynamic anchoring shaped public discourse. Through incisive reporting and fearless questioning, Shahid Masood established himself as a voice for accountability and truth in journalism.',
            imagePosition: 'right',
        },
        {
            id: 'kamran-ashraf',
            name: 'Kamran Ashraf',
            title: 'National Hockey Player',
            image: alumni7,
            description:
                'An accomplished athlete who represented Pakistan with distinction on the international hockey stage. Kamran\'s dedication to athletic excellence and sportsmanship elevated the nation\'s sporting legacy and inspired generations of aspiring athletes.',
            imagePosition: 'left',
        },
        {
            id: 'shahid-ali',
            name: 'Shahid Ali Khan',
            title: 'National Hockey Player',
            image: alumni8,
            description:
                'A celebrated hockey champion whose exceptional skill and competitive spirit defined an era of Pakistani sports excellence. Shahid Ali Khan\'s contributions to national athletics strengthened Pakistan\'s position in international sporting competitions.',
            imagePosition: 'right',
        },
        {
            id: 'sohail-rana',
            name: 'Sohail Rana',
            title: 'Film and Television Music Composer',
            image: alumni9,
            description:
                'A visionary composer whose music became the heartbeat of Pakistani cinema and television. Sohail Rana\'s innovative compositions and artistic genius created timeless soundtracks that transcended generations and defined cultural moments in entertainment history.',
            imagePosition: 'left',
        },
        {
            id: 'syed-murad',
            name: 'Syed Murad Ali Shah',
            title: 'Chief Minister of Sindh, Pakistan',
            image: alumni10,
            description:
                'A respected political leader whose administrative vision and progressive policies transformed provincial governance. As Chief Minister, Syed Murad Ali Shah championed development initiatives, economic growth, and institutional reforms that advanced provincial prosperity.',
            imagePosition: 'right',
        },
        {
            id: 'ghulam-hussain',
            name: 'Ghulam Hussain Hidayatullah',
            title: 'Former Chief Minister of Sindh',
            image: alumni11,
            description:
                'A pioneering administrator whose leadership during formative years established foundational governance structures. Ghulam Hussain Hidayatullah\'s administrative acumen and vision for provincial development left an indelible mark on Sindh\'s political history.',
            imagePosition: 'left',
        },
        {
            id: 'km-kundnani',
            name: 'K. M. Kundnani',
            title: 'Principal, D.G. National College (1947) & Founder, R.D. National College, Mumbai',
            image: alumni12,
            description:
                'An educational visionary who transformed academic institutions into centers of excellence. K. M. Kundnani\'s foundational contributions to education shaped entire generations of scholars and established institutional legacies that endure across South Asia.',
            imagePosition: 'right',
        },
        {
            id: 'dolarrai-mankad',
            name: 'Dolarrai Mankad',
            title: 'Renowned Sanskrit Scholar & First Vice-Chancellor of Saurashtra University',
            image: alumni13,
            description:
                'A legendary Sanskrit scholar whose intellectual contributions elevated classical studies in academia. As the first Vice-Chancellor of Saurashtra University, Dolarrai Mankad established scholarly standards and fostered an environment of intellectual excellence and cultural preservation.',
            imagePosition: 'left',
        },
        {
            id: 'moiz-ullah',
            name: 'Moiz Ullah Baig',
            title: 'International Scrabble Player, Pakistan Scrabble Champion & World Junior Champion (2018)',
            image: alumni14,
            description:
                'A world-class intellect whose strategic mastery of language games brought international recognition to Pakistan. Moiz Ullah Baig\'s championship wins and competitive excellence demonstrated the nation\'s mental prowess on the global stage.',
            imagePosition: 'right',
        },
        {
            id: 'jamshed-mehta',
            name: 'Jamshed Nusserwanjee Mehta',
            title: 'First Mayor of Karachi',
            image: alumni15,
            description:
                'A founding civic leader whose administrative vision shaped Karachi\'s governance. As the city\'s first mayor, Jamshed Nusserwanjee Mehta established municipal institutions and urban development frameworks that transformed the metropolis into a thriving center of commerce and culture.',
            imagePosition: 'left',
        },
    ];

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
