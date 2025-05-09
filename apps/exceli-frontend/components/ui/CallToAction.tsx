'use client'
import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  "Unlimited diagrams and drawings",
  "Real-time collaboration",
  "Export to PNG, SVG, and PDF",
  "Library of ready-to-use components",
  "Custom styles and colors",
  "Private sharing links"
];

const CallToAction = () => {
  return (
    <section id="pricing" className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Creating Beautiful Diagrams Today</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of professionals who trust Excalidraw for their visual communication needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white text-gray-800 rounded-xl p-8 shadow-lg">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
              <p className="text-gray-600 mb-6">Perfect for individuals and small teams</p>
              
              <div className="mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium text-lg flex items-center justify-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col justify-center items-center text-center border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0 md:pl-8">
              <div className="bg-blue-100 text-blue-800 rounded-full px-6 py-3 text-lg font-medium mb-4">
                Pro Plan Coming Soon
              </div>
              <p className="text-gray-600 mb-4">
                Sign up for updates on our upcoming Pro features
              </p>
              <div className="flex w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;