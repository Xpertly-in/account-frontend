"use client";

import { Button } from "@/ui/Button.ui";
import { Card, CardContent } from "@/ui/Card.ui";
import { FileText, Calculator, Shield, TrendingUp, Rocket } from "lucide-react";

const CategorySection = () => {
  const categories = [
    {
      icon: FileText,
      title: "GST",
      description: "GST Registration, Filing & Compliance",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      icon: Calculator,
      title: "ITR Filing",
      description: "Income Tax Return Filing & Planning",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700"
    },
    {
      icon: Shield,
      title: "Audit",
      description: "Statutory & Internal Audit Services",
      color: "bg-blue-700",
      hoverColor: "hover:bg-blue-800"
    },
    {
      icon: TrendingUp,
      title: "Investment",
      description: "Financial Planning & Investment Advisory",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      icon: Rocket,
      title: "Startup",
      description: "Business Registration & Compliance",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Browse by Category */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Services We Offer
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Browse by <span className="text-blue-600 dark:text-blue-400">Category</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Find the perfect chartered accountant for your specific financial needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.title}
                className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full flex flex-col"
              >
                <CardContent className="p-6 lg:p-8 text-center flex flex-col h-full">
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 ${category.color} ${category.hoverColor} rounded-xl flex items-center justify-center mx-auto mb-4 lg:mb-6 transition-colors duration-300 group-hover:scale-110 transform`}>
                    <IconComponent className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm lg:text-base mb-6 flex-grow">
                    {category.description}
                  </p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-300 group-hover:scale-105"
                  >
                    Find CA
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection; 