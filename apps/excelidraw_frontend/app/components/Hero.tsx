'use client'
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link'


const Hero = () => {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Draw, <span className="text-blue-600">collaborate</span>, and share your ideas
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Create beautiful hand-drawn diagrams, wireframes, and illustrations in seconds. Share and collaborate in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signin">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium text-lg flex items-center justify-center">
                  Signin <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Link href="/signup">
                <button className="border border-gray-300 hover:border-blue-600 text-gray-800 hover:text-blue-600 px-6 py-3 rounded-lg transition-colors font-medium text-lg">
                  Sinup
                </button>
              </Link>
              
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-teal-100 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-white rounded-2xl shadow-lg p-4 transform -rotate-2 transition-transform hover:rotate-0 duration-500">
                <img 
                  src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Excalidraw interface example" 
                  className="rounded-lg w-full"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-full shadow-lg text-blue-600 animate-bounce">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 15.5C15 15.5 16 14.5 16 12C16 9.5 15 8.5 15 8.5M8.5 15.5C8.5 15.5 7.5 14.5 7.5 12C7.5 9.5 8.5 8.5 8.5 8.5M7.5 12H16" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <div className="absolute top-1/4 -right-8 bg-blue-100 p-4 rounded-lg shadow-md transform rotate-6 hidden md:block">
              <p className="text-blue-800 font-medium">Real-time collaboration!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;