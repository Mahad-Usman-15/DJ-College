'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CiMenuFries } from "react-icons/ci";
export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white px-[40px] py-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] sticky top-0 z-[100]">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link href={"/"}>
                    <div className="text-[18px] font-semibold text-[#2d5016]">
                        DJ Science College
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 list-none m-0 p-0">
                    <Link
                        href="/"
                        className="relative text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] hover:text-[#10b981] after:bg-[#2d5016] after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Home
                    </Link>
                    <Link
                        href="/admission"
                        className="relative text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] hover:text-[#10b981] after:bg-[#2d5016] after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Admission
                    </Link>

                    <Link
                        href="/alumni"
                        className="relative text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#2d5016] after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Alumni
                    </Link>

                    <Link
                        href="/facilities"
                        className="relative text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#2d5016] after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Facilities
                    </Link>

                    <Link
                        href="/contact"
                        className="relative text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#2d5016] after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Contact
                    </Link>


                </nav>

                {/* Mobile Toggle */}
                <button
                    className="flex md:hidden items-center justify-center bg-transparent border-none cursor-pointer p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <CiMenuFries className="text-black size-6"/>

                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white flex flex-col gap-4 px-[40px] py-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] md:hidden">
                    <Link
                     href="/"
                        className="text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016]"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                       href="/admission"
                        className="text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016]"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Admission
                    </Link>
                    <Link
                           href="/alumni"
                        className="text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016]"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Alumni
                    </Link>
                    <Link
                    href="/facilities"
                        className="text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016]"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Facilities
                    </Link>
                    <Link
                       href="/contact"
                        className="text-[#2c2c2c] font-medium text-[15px] transition-colors duration-300 hover:text-[#2d5016]"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                </div>
            )}
        </header>
    );
}
