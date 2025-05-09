
'use client'
import React from 'react';
import { Wand2, Share2, Layers, Lock, Palette, Smile } from 'lucide-react';

const features = [
  {
    icon: <Wand2 className="h-8 w-8 text-blue-600" />,
    title: 'Beautiful Hand-drawn Style',
    description: 'Create sketches that look authentically hand-drawn with our special rendering engine.'
  },
  {
    icon: <Share2 className="h-8 w-8 text-blue-600" />,
    title: 'Easy Sharing',
    description: 'Share your drawings with a simple link or export to various formats with one click.'
  },
  {
    icon: <Layers className="h-8 w-8 text-blue-600" />,
    title: 'Rich Components',
    description: 'Access a library of ready-to-use shapes, connectors, and design elements.'
  },
  {
    icon: <Lock className="h-8 w-8 text-blue-600" />,
    title: 'Secure and Private',
    description: 'Your drawings are encrypted and you control who can view or edit them.'
  },
  {
    icon: <Palette className="h-8 w-8 text-blue-600" />,
    title: 'Customizable',
    description: 'Personalize colors, stroke width, and styles to match your preferences.'
  },
  {
    icon: <Smile className="h-8 w-8 text-blue-600" />,
    title: 'Intuitive Interface',
    description: 'Simple, clean design that lets you focus on your creative process.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Drawing Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to bring your ideas to life, without the complexity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-5 bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;