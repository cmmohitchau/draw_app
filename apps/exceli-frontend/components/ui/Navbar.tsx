'use client'
import React, { useState, useEffect } from 'react';
import { Menu, X, Pencil } from 'lucide-react';
import { ModeToggle } from './modeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Pencil className="h-8 w-8 mr-2 text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Excalidraw
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors">
            Demo
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
            Pricing
          </a>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Try Now
          </button>
          <ModeToggle />

        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a 
              href="#demo" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Demo
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#pricing" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </a>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full">
              Try Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;