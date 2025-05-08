import CallToAction from '@/components/CallToAction';
import Demo from '@/components/Demo';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Testimonials from '@/components/Testimonials';
import React from 'react';


export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Hero />
      <Features />
      <Demo />
      <Testimonials />
      <CallToAction />
      <Footer />
      <h1 className='bg-red-500'>Hello</h1>
    </div>
  );
};

