'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import principal from "../images/Mohsin Shaikh3.jpg";
import Link from 'next/link';

export function CollegePageClient() {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
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
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-sans text-[#1a1a1a] bg-[#fafaf9]">
      <div className=" ">

        {/* ================= HERO INTRO ================= */}
        <section
          ref={(el) => (sectionRefs.current['intro'] = el)}
          id="intro"
          className={`relative min-h-screen flex items-center justify-center overflow-hidden
          bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700
          transition-all duration-700
          ${visibleSections['intro'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 text-center text-white max-w-5xl px-6">
            <h1 className="text-[clamp(32px,5vw,56px)] font-bold leading-tight mb-6">
              Welcome to{' '}
              <span className="text-emerald-300">
                D.J. Sindh Government Science College
              </span>
            </h1>

            <p className="text-[clamp(14px,2vw,18px)] leading-relaxed max-w-3xl mx-auto mb-10">
              D.J. Sindh Government Science College ( ڈی جے سندھ گورنمنٹ سائنس کالج),
              commonly known as DJ Science College, is a public college affiliated
              with the University of Karachi. It is located near Burns Road,
              Karachi, Sindh, Pakistan.
            </p>
           <Link href={"/admission"}>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white text-emerald-800 font-semibold px-8 py-3 rounded-lg hover:bg-emerald-100 transition shadow-lg">
                Explore More
              </button>
            </div>
            </Link>
          </div>
        </section>

        {/* ================= PRINCIPAL MESSAGE ================= */}
        <section
          ref={(el) => (sectionRefs.current['hero'] = el)}
          id="hero"
          className={`grid md:grid-cols-2 gap-10 items-center my-20 p-5
          transition-all duration-700
          ${visibleSections['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <div className="relative w-full h-[350px] md:h-[420px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={principal}
              alt="Principal"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Principal&apos;s Message
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to DJ Science College, where academic excellence meets innovation.
              We foster critical thinking, research, and personal growth. Our
              dedicated faculty and modern facilities provide students with the
              tools they need to succeed in their academic journey and beyond.
            </p>
            <h3 className='mt-3 font-bold text-xl  md:text-2xl'>- Professor Mohsin Shaikh</h3>
          </div>
        </section>

        {/* ================= FACILITIES ================= */}
        <section
          ref={(el) => (sectionRefs.current['premises'] = el)}
          id="premises"
          className={`my-20 transition-all duration-700 p-5
          ${visibleSections['premises'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Facilities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Main Building - New Portion',
                text: 'Houses administration offices and departments including Urdu, Statistics, Islamic Studies and Pakistan Studies.',
              },
              {
                title: 'Main Building - Historic Portion',
                text: 'Features departments of Biochemistry, Botany, English, Physics, Chemistry, Computer Science, Microbiology and Zoology.',
              },
              {
                title: 'A.Q. Block',
                text: 'Dedicated classrooms specially designed for first-year students.',
              },
              {
                title: 'Science & Mathematics Wing',
                text: 'Home to the Main Library, Mathematics and Geology departments.',
              },
              {
                title: 'M.Sc. Block',
                text: 'Under construction with advanced facilities for higher education.',
              },
              {
                title: 'Gymnasium & Sports Complex',
                text: 'Offers cricket, football, and other recreational activities.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-600 hover:-translate-y-1 transition"
              >
                <h3 className="text-emerald-700 font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PROGRAMS ================= */}
        <section
          ref={(el) => (sectionRefs.current['affiliation'] = el)}
          id="affiliation"
          className={`my-20 bg-gray-100 p-10 rounded-xl transition-all duration-700 p-5
          ${visibleSections['affiliation'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Academic Programs
          </h2>

          <p className="text-gray-600 mb-6">
            Undergraduate students can select combinations from the following subjects:
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              'Mathematics',
              'Physics',
              'Chemistry',
              'Geology',
              'Statistics',
              'Microbiology',
              'Biochemistry',
              'Botany',
              'Zoology',
            ].map((sub) => (
              <span
                key={sub}
                className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm"
              >
                {sub}
              </span>
            ))}
          </div>

          <p className="text-gray-600 mt-8">
            The college also offers a three-year Bachelor of Computer Science (B.C.S.)
            semester system programme affiliated with the University of Karachi.
          </p>
        </section>

        {/* ================= AIM ================= */}
        <section
          ref={(el) => (sectionRefs.current['aim'] = el)}
          id="aim"
          className={`my-20 text-center transition-all duration-700 p-5
          ${visibleSections['aim'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Aim</h2>

          <p className="max-w-2xl mx-auto text-gray-600 mb-10">
            We cultivate intellectual growth and foster excellence in education,
            research, and innovation.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Academic Excellence',
                text: 'Deliver world-class education with strong curriculum standards.',
              },
              {
                title: 'Research & Innovation',
                text: 'Promote meaningful research and scientific advancement.',
              },
              {
                title: 'Student Development',
                text: 'Build leadership, character, and critical thinking.',
              },
              {
                title: 'Social Impact',
                text: 'Address real-world challenges and create positive change.',
              },
            ].map((aim) => (
              <div
                key={aim.title}
                className="bg-white p-6 rounded-xl shadow-md border-t-4 border-emerald-600"
              >
                <h3 className="text-emerald-700 font-semibold mb-2">
                  {aim.title}
                </h3>
                <p className="text-gray-600 text-sm">{aim.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}