'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from "../../images/logo.jpg";

export default function Footer() {
  const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/admission', label: 'Admission' },
    { href: '/alumni', label: 'Alumni' },
    { href: '/facilities', label: 'Facilities' },
    { href: '/contact', label: 'Contact Us' }
  ];

  const socialLinks = [
    { icon: 'f', href: 'https://www.facebook.com/DJSindhCollege/', label: 'Facebook' },
    { icon: 'in', href: 'https://pk.linkedin.com/school/d-j-science-college/', label: 'LinkedIn' },
    { icon: 'ig', href: 'https://www.instagram.com/dj_ijt/?hl=en', label: 'Instagram' }
  ];

  return (
    <footer className=" bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-[#f8f7f4] px-[40px] pt-[48px] pb-[24px] mt-[80px]">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px] md:gap-[48px] mb-[40px]">
          
          {/* First Column - Logo */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src={logo}
                width={100}
                alt="College-Logo"
                className="w-[50px] h-[50px] rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              />
            </Link>
          </div>

          {/* Second Column - Links */}
          <div className="flex flex-col items-start">
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#f8f7f4] text-[14px] transition-colors duration-300 hover:text-[#a8d26f]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Third Column - Social Media */}
          <div className="flex flex-col items-start">
            <ul className="flex gap-4 list-none m-0 p-0">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <Link
                    href={social.href}
                    title={social.label}
                    className="w-[40px] h-[40px] bg-white/10 rounded-full flex items-center justify-center text-[#f8f7f4] font-bold text-[16px] transition-all duration-300 hover:bg-[#a8d26f] hover:text-[#2d5016]"
                  >
                    {social.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-[32px]" />

        {/* Bottom */}
        <div className="text-center text-[14px] text-white/70">
          <p>&copy; 2024 College. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
