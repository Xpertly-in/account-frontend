
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What does a Chartered Accountant (CA) do?",
      answer: "A Chartered Accountant is a qualified financial professional who provides various services including tax preparation and filing, financial auditing, business advisory, GST compliance, investment planning, and financial reporting. CAs help individuals and businesses manage their finances efficiently and ensure compliance with tax laws and regulations."
    },
    {
      question: "How can I find a qualified CA near me?",
      answer: "You can easily find qualified CAs in your area through our platform by using the search function. Simply enter your location and service requirements. All CAs on our platform are verified professionals with proper certification. You can view their profiles, read reviews, and compare their expertise before making a choice."
    },
    {
      question: "Is online CA consultation safe and reliable?",
      answer: "Yes, online CA consultation is completely safe and reliable. Our platform uses advanced security measures to protect your financial data. All communications are encrypted, and our CAs are bound by professional confidentiality. Many routine services like tax filing, GST returns, and financial planning can be effectively handled online."
    },
    {
      question: "What are the typical fees for CA services?",
      answer: "CA fees vary based on the complexity and type of service required. Basic services like ITR filing start from ₹500-2000, while GST registration and compliance may range from ₹3000-10000. Complex services like auditing and business advisory are usually quoted based on specific requirements. You can compare prices from different CAs on our platform."
    },
    {
      question: "How long does it take to get my tax returns filed?",
      answer: "The time required depends on the complexity of your tax situation. Simple individual ITR filing typically takes 2-3 business days, while more complex returns with multiple income sources or business income may take 5-7 days. Our CAs work efficiently to ensure your returns are filed well before the deadline."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300">
            Get answers to common questions about our CA services and platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:text-blue-900 dark:hover:text-blue-400 focus:!outline-none focus:ring-0 focus:ring-white rounded-lg flex items-center justify-between"
              >
                <span className="pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Still have questions?</p>
          <div className="space-x-4">
            <a 
              href="#contact" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold underline"
            >
              Contact Support
            </a>
            <span className="text-gray-400">•</span>
            <a 
              href="#help" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold underline"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 