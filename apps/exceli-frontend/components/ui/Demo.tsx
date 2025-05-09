'use client'

import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

const demoContent = [
  {
    title: "Create Flowcharts",
    description: "Design beautiful flowcharts with our intuitive drawing tools. Connect shapes with smart arrows that adjust automatically.",
    image: "https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    title: "Design Wireframes",
    description: "Quickly sketch UI wireframes and mockups. The hand-drawn style helps keep the focus on layout and functionality.",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    title: "Collaborative Brainstorming",
    description: "Invite team members to collaborate in real-time. Perfect for remote teams to visualize ideas together.",
    image: "https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const Demo = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === demoContent.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? demoContent.length - 1 : prevIndex - 1));
  };

  return (
    <section id="demo" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how Excalidraw makes visual communication effortless
          </p>
        </div>
        
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden max-w-6xl mx-auto">
          <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-teal-500 h-1"></div>
          
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium inline-block mb-4 w-max">
                {`Feature ${activeIndex + 1}/${demoContent.length}`}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {demoContent[activeIndex].title}
              </h3>
              <p className="text-gray-600 mb-8">
                {demoContent[activeIndex].description}
              </p>
              <div className="flex items-center gap-4">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-lg flex items-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Tutorial
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrev}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <img 
                src={"https://wallpaperbat.com/img/19061822-jai-shri-ram-wallpaper-4k-hindu-god.jpg"} 
                alt={demoContent[activeIndex].title} 
                className="w-full h-full object-cover"
                style={{ minHeight: '400px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;