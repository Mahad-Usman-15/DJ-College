'use client';

import { useState } from 'react';
import { LocalBusinessSchema, FAQPageSchema } from '../components/schema';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      {/* Schema markup for the contact page */}
      <LocalBusinessSchema 
        name="D.J. Sindh Government Science College"
        image="/images/contact-information.jpg"
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
            name: 'What is the college address?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The college is located at V237+CQ5, Dr Ziauddin Ahmed Rd, Saddar Seari Quarters, Karachi, Pakistan.'
            }
          },
          {
            '@type': 'Question',
            name: 'How can I contact the college?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can contact us by phone at +92 21 XXXX XXXX or by email at info@college.edu.pk.'
            }
          }
        ]}
      />
      
      {/* Header */}
      <header className="bg-[#2d5016] text-white px-5 py-10 text-center">
        <h1 className="text-[2.5rem] font-bold mb-2">Contact Us</h1>
        <p className="text-[1.1rem] opacity-90">
          Get in touch with our college
        </p>
      </header>

      {/* Main */}
      <main className="px-5 py-10 max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-[40px] md:gap-[60px] mb-[60px]">
          
          {/* Contact Form */}
          <div className="min-h-[500px] flex flex-col justify-start">
            <h2 className="text-[1.8rem] font-bold mb-[30px] text-[#2d5016]">
              Send us a Message
            </h2>

            {submitted && (
              <div className="bg-[#d4edda] text-[#155724] p-[15px] rounded-[5px] mb-[20px] border border-[#c3e6cb]">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[20px]"
            >
              {/* Name */}
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="mb-2 font-semibold text-[#2c2c2c] text-[1rem]"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="p-3 border-2 border-[#ddd] rounded-[5px] text-[1rem] transition-colors duration-300 focus:border-[#2d5016] outline-none"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="mb-2 font-semibold text-[#2c2c2c] text-[1rem]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="p-3 border-2 border-[#ddd] rounded-[5px] text-[1rem] transition-colors duration-300 focus:border-[#2d5016] outline-none"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="mb-2 font-semibold text-[#2c2c2c] text-[1rem]"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="p-3 border-2 border-[#ddd] rounded-[5px] text-[1rem] transition-colors duration-300 focus:border-[#2d5016] outline-none"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label
                  htmlFor="message"
                  className="mb-2 font-semibold text-[#2c2c2c] text-[1rem]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="p-3 border-2 border-[#ddd] rounded-[5px] text-[1rem] resize-y transition-colors duration-300 focus:border-[#2d5016] outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-[10px] px-[30px] py-[15px] bg-[#2d5016] text-white rounded-[5px] text-[1.1rem] font-semibold transition-colors duration-300 hover:bg-[#1f3610]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map */}
          <div className="min-h-[500px] flex flex-col">
            <h2 className="text-[1.8rem] font-bold mb-[30px] text-[#2d5016]">
              Location
            </h2>
            <div className="flex-1 rounded-[8px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <iframe
                title="College Location"
                className="w-full h-full border-0"
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.302320124097!2d67.01189607442947!3d24.853522145536882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e0ecfdf5d61%3A0x1717b3066d311922!2sDJ%20Sindh%20Govt.%20Science%20College!5e0!3m2!1sen!2s!4v1770755878811!5m2!1sen!2s"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
            </div>
          </div>
        </div>

        {/* Extra Info */}
        <div className="bg-[#f8f7f4] p-[40px] rounded-[8px] mt-[60px]">
          <h2 className="text-[1.8rem] font-bold mb-[30px] text-[#2d5016] text-center">
            Additional Contact Information
          </h2>

          <div className="grid gap-[30px] grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            <div className="text-center">
              <h3 className="text-[1.3rem] font-semibold mb-[10px] text-[#2d5016]">
                Address
              </h3>
              <p className="text-[#666] leading-[1.6]">
            V237+CQ5, Dr Ziauddin Ahmed Rd,
             <br /> Saddar Seari Quarters, Karachi, Pakistan
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-[1.3rem] font-semibold mb-[10px] text-[#2d5016]">
                Phone
              </h3>
              <p className="text-[#666] leading-[1.6]">
                +92 21 XXXX XXXX <br />
                +92 21 YYYY YYYY
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-[1.3rem] font-semibold mb-[10px] text-[#2d5016]">
                Email
              </h3>
              <p className="text-[#666] leading-[1.6]">
                info@college.edu.pk <br />
                admissions@college.edu.pk
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
