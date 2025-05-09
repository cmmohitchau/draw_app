'use client'
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Excalidraw has completely changed how we communicate design ideas across our team. The simplicity is deceptive - it's incredibly powerful.",
    author: "Sarah Johnson",
    role: "UX Designer at Dropbox",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    stars: 5
  },
  {
    quote: "I use Excalidraw daily for my product planning. The hand-drawn style keeps stakeholders focused on the concept rather than the details.",
    author: "Michael Chen",
    role: "Product Manager at Spotify",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    stars: 5
  },
  {
    quote: "As a teacher, I needed something simple yet effective to create diagrams for my students. Excalidraw is perfect - intuitive and fun to use.",
    author: "Emily Rodriguez",
    role: "Computer Science Professor",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    stars: 4
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied creatives, engineers, and educators
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md relative"
            >
              <div className="absolute -top-4 left-8 bg-blue-600 text-white p-2 rounded-md">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 inline-block fill-current" />
                ))}
              </div>
              <div className="mt-4 mb-6">
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium">{testimonial.author}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;