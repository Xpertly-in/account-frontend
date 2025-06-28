"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { Calendar, ExternalLink, TrendingUp } from "lucide-react";

const FinanceNewsSection = () => {
  const financeNews = [
    {
      id: 1,
      title: "New GST Rules for E-commerce Platforms in 2024",
      excerpt: "The government has introduced new GST compliance requirements for e-commerce platforms, affecting millions of sellers across India.",
      date: "2024-01-28",
      category: "GST Updates",
      url: "https://economictimes.indiatimes.com/news/economy/policy/new-gst-rules-for-e-commerce-platforms-in-2024/articleshow/example",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Income Tax Slab Changes: What You Need to Know",
      excerpt: "Budget 2024 brings significant changes to income tax slabs. Here's how it affects your tax planning strategy.",
      date: "2024-01-25",
      category: "Income Tax",
      url: "https://economictimes.indiatimes.com/news/economy/policy/income-tax-slab-changes-budget-2024/articleshow/example",
      image: "https://images.unsplash.com/photo-1559589689-577aabd1db4f?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Digital Banking Revolution: Impact on CA Services",
      excerpt: "How digital banking transformation is changing the landscape of chartered accountancy services in India.",
      date: "2024-01-22",
      category: "Digital Finance",
      url: "https://economictimes.indiatimes.com/news/economy/finance/digital-banking-revolution-ca-services/articleshow/example",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop"
    }
  ];

  const handleReadMore = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Latest Updates
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Finance <span className="text-blue-600 dark:text-blue-400">News & Updates</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest financial regulations, tax changes, and industry news from India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {financeNews.map((article) => (
            <Card key={article.id} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                  {article.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0 pb-2">
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(article.date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
                    onClick={() => handleReadMore(article.url)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinanceNewsSection; 