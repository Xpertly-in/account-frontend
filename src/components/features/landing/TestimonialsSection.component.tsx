"use client";

import { Card, CardContent } from "@/ui/Card.ui";
import { useState, useEffect } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Small Business Owner",
      company: "Sharma Textiles",
      location: "Mumbai, Maharashtra",
      content: "CA Connect helped me find the perfect chartered accountant for my textile business. The GST filing process became so much smoother!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b765?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      savings: "₹50,000"
    },
    {
      name: "Rajesh Kumar",
      role: "Startup Founder",
      company: "TechInnovate Solutions",
      location: "Bangalore, Karnataka",
      content: "As a startup founder, I needed expert guidance on compliance. The CA I found has been instrumental in our company's financial health.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      savings: "₹75,000"
    },
    {
      name: "Anita Desai",
      role: "Freelance Consultant",
      company: "Independent Professional",
      location: "Pune, Maharashtra",
      content: "Managing my income tax was always stressful. The chartered accountant I connected with made everything simple and transparent.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      savings: "₹25,000"
    },
    {
      name: "Vikram Singh",
      role: "Manufacturing Owner",
      company: "Singh Industries",
      location: "Delhi, NCR",
      content: "The audit support I received was exceptional. My CA helped streamline our entire financial process and ensured compliance.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      savings: "₹1,20,000"
    },
    {
      name: "Meera Patel",
      role: "E-commerce Entrepreneur",
      company: "StyleHub Online",
      location: "Ahmedabad, Gujarat",
      content: "Starting an e-commerce business seemed daunting until I found my CA through this platform. Professional service with great support!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      savings: "₹40,000"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="py-16 lg:py-20 bg-blue-50 dark:bg-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Client Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            What Our <span className="text-blue-600 dark:text-blue-400">Clients Say</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied clients who found their perfect CA through our platform.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <CaretLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <CaretRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Testimonials Grid - Smaller Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 px-12">
            {getVisibleTestimonials().map((testimonial, index) => (
              <Card
                key={`${testimonial.name}-${currentIndex}-${index}`}
                className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group h-80"
              >
                <CardContent className="p-4 lg:p-6 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Quote - Smaller text */}
                  <blockquote className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 italic text-center flex-grow group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author - Compact */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <img
                        src={testimonial.avatar}
                        alt={`${testimonial.name} profile picture`}
                        className="w-12 h-12 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                        {testimonial.role}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 text-xs font-medium mb-2">
                        📍 {testimonial.location}
                      </p>
                      {/* Savings Badge */}
                      <div className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                        <span className="text-green-700 dark:text-green-300 text-xs font-semibold">
                          💰 Saved {testimonial.savings}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-blue-600 w-8"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mt-12 lg:mt-16">
          <div className="text-center group">
            <div className="text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-300 mb-2 group-hover:scale-110 transition-transform duration-300">
              1000+
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Verified CAs</div>
          </div>
          <div className="text-center group">
            <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
              50,000+
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Happy Clients</div>
          </div>
          <div className="text-center group">
            <div className="text-2xl lg:text-3xl font-bold text-blue-700 dark:text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">
              ₹10Cr+
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Tax Savings</div>
          </div>
          <div className="text-center group">
            <div className="text-2xl lg:text-3xl font-bold text-blue-800 dark:text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              4.9★
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 