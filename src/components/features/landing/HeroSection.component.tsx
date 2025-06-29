"use client";

import { useState, useEffect } from "react";
import { Button } from "@/ui/Button.ui";
import { CustomSelect, SelectOption } from "@/ui/Select.ui";
import {
  MagnifyingGlass,
  MapPin,
  Buildings,
  Bank,
  Tree,
  Waves,
  Mountains,
  Sun,
  Star,
  Calendar,
  Medal,
  Calculator,
  FileText,
  ChartPie,
  TrendUp,
  ArrowDown,
  Shield,
  Rocket,
} from "@phosphor-icons/react";
import Image from "next/image";
import { CAService } from "@/services/ca.service";
import { CA } from "@/types/ca.type";

const HeroSection = () => {
  const [selectedService, setSelectedService] = useState<SelectOption | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>(null);
  const [featuredCAs, setFeaturedCAs] = useState<CA[]>([]);
  const [isLoadingCAs, setIsLoadingCAs] = useState(true);

  // Service options for autocomplete
  const serviceOptions: SelectOption[] = [
    { value: "gst-registration", label: "GST Registration" },
    { value: "gst-filing", label: "GST Filing" },
    { value: "gst-return-filing", label: "GST Return Filing" },
    { value: "income-tax-filing", label: "Income Tax Filing" },
    { value: "itr-filing", label: "ITR Filing" },
    { value: "tax-planning", label: "Tax Planning" },
    { value: "tax-consultation", label: "Tax Consultation" },
    { value: "statutory-audit", label: "Statutory Audit" },
    { value: "internal-audit", label: "Internal Audit" },
    { value: "company-audit", label: "Company Audit" },
    { value: "financial-audit", label: "Financial Audit" },
    { value: "investment-planning", label: "Investment Planning" },
    { value: "financial-planning", label: "Financial Planning" },
    { value: "mutual-fund-advisory", label: "Mutual Fund Advisory" },
    { value: "insurance-planning", label: "Insurance Planning" },
    { value: "company-registration", label: "Company Registration" },
    { value: "partnership-registration", label: "Partnership Registration" },
    { value: "llp-registration", label: "LLP Registration" },
    { value: "startup-registration", label: "Startup Registration" },
    { value: "business-setup", label: "Business Setup" },
    { value: "compliance-management", label: "Compliance Management" },
    { value: "book-keeping", label: "Book Keeping" },
    { value: "accounting-services", label: "Accounting Services" },
    { value: "payroll-management", label: "Payroll Management" },
    { value: "tds-filing", label: "TDS Filing" },
    { value: "esi-pf-registration", label: "ESI & PF Registration" },
  ];

  // City options for autocomplete
  const cityOptions: SelectOption[] = [
    { value: "mumbai-maharashtra", label: "Mumbai, Maharashtra" },
    { value: "delhi-delhi", label: "Delhi, Delhi" },
    { value: "bangalore-karnataka", label: "Bangalore, Karnataka" },
    { value: "chennai-tamil-nadu", label: "Chennai, Tamil Nadu" },
    { value: "kolkata-west-bengal", label: "Kolkata, West Bengal" },
    { value: "pune-maharashtra", label: "Pune, Maharashtra" },
    { value: "hyderabad-telangana", label: "Hyderabad, Telangana" },
    { value: "ahmedabad-gujarat", label: "Ahmedabad, Gujarat" },
    { value: "jaipur-rajasthan", label: "Jaipur, Rajasthan" },
    { value: "surat-gujarat", label: "Surat, Gujarat" },
    { value: "lucknow-uttar-pradesh", label: "Lucknow, Uttar Pradesh" },
    { value: "kanpur-uttar-pradesh", label: "Kanpur, Uttar Pradesh" },
    { value: "nagpur-maharashtra", label: "Nagpur, Maharashtra" },
    { value: "indore-madhya-pradesh", label: "Indore, Madhya Pradesh" },
    { value: "thane-maharashtra", label: "Thane, Maharashtra" },
    { value: "bhopal-madhya-pradesh", label: "Bhopal, Madhya Pradesh" },
    { value: "visakhapatnam-andhra-pradesh", label: "Visakhapatnam, Andhra Pradesh" },
    { value: "pimpri-chinchwad-maharashtra", label: "Pimpri-Chinchwad, Maharashtra" },
    { value: "patna-bihar", label: "Patna, Bihar" },
    { value: "vadodara-gujarat", label: "Vadodara, Gujarat" },
  ];

  const popularCities = [
    { name: "Mumbai", icon: Buildings, color: "text-blue-600", landmark: "Gateway of India" },
    { name: "Delhi", icon: Bank, color: "text-red-600", landmark: "Red Fort" },
    { name: "Bangalore", icon: Tree, color: "text-green-600", landmark: "Silicon Valley" },
    { name: "Chennai", icon: Waves, color: "text-cyan-600", landmark: "Marina Beach" },
    { name: "Kolkata", icon: Buildings, color: "text-yellow-600", landmark: "Victoria Memorial" },
    { name: "Pune", icon: Mountains, color: "text-purple-600", landmark: "Shaniwar Wada" },
    { name: "Hyderabad", icon: Sun, color: "text-orange-600", landmark: "Charminar" },
    { name: "Ahmedabad", icon: Buildings, color: "text-pink-600", landmark: "Sabarmati Ashram" },
  ];

  // Fetch featured CAs from Supabase
  useEffect(() => {
    const fetchFeaturedCAs = async () => {
      try {
        setIsLoadingCAs(true);
        const cas = await CAService.getFeaturedCAs(3);
        setFeaturedCAs(cas);
      } catch (error) {
        console.error("Error fetching featured CAs:", error);
        // Fallback to empty array if fetch fails
        setFeaturedCAs([]);
      } finally {
        setIsLoadingCAs(false);
      }
    };

    fetchFeaturedCAs();
  }, []);

  const handleCAClick = (caId: string) => {
    window.location.href = `/ca-profile/${caId}`;
  };

  const handleSearch = () => {
    // Handle search logic here
    console.log("Searching for:", { service: selectedService, location: selectedLocation });
  };

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900 dark:via-gray-900 dark:to-blue-800 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Column - Content */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              India's #1 CA Platform
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Find Trusted{" "}
              <span className="text-blue-600 dark:text-blue-400">Chartered Accountants</span> for
              Your Financial Needs
            </h1>

            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl">
              Expert <strong className="text-blue-700 dark:text-blue-300">GST Filing</strong>,{" "}
              <strong className="text-blue-800 dark:text-blue-300">Income Tax</strong>,{" "}
              <strong className="text-blue-900 dark:text-blue-300">Audit Support</strong> & More.
              Connect with qualified CAs who understand your business and provide personalized
              financial solutions across India.
            </p>

            {/* Enhanced Search Bar with CustomSelect */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 mb-8 border border-gray-100 dark:border-gray-700 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <CustomSelect
                  options={serviceOptions}
                  value={selectedService}
                  onChange={option => {
                    // CustomSelect can return array for multi-select, but we only want single values
                    if (Array.isArray(option)) {
                      setSelectedService(option[0] || null);
                    } else {
                      setSelectedService(option);
                    }
                  }}
                  placeholder="What service do you need?"
                  icon={<MagnifyingGlass className="h-5 w-5" />}
                  noOptionsMessage={() => "No services found"}
                />
                <CustomSelect
                  options={cityOptions}
                  value={selectedLocation}
                  onChange={option => {
                    // CustomSelect can return array for multi-select, but we only want single values
                    if (Array.isArray(option)) {
                      setSelectedLocation(option[0] || null);
                    } else {
                      setSelectedLocation(option);
                    }
                  }}
                  placeholder="Enter your city"
                  icon={<MapPin className="h-5 w-5" />}
                  noOptionsMessage={() => "No cities found"}
                />
              </div>
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg"
                onClick={handleSearch}
              >
                <MagnifyingGlass className="mr-2 h-5 w-5" />
                Find Your Perfect CA
              </Button>
            </div>

            <div className="mb-8 max-w-4xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                Find CAs in Popular Cities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {popularCities.map((city, index) => {
                  const IconComponent = city.icon;
                  return (
                    <Button
                      key={city.name}
                      variant="outline"
                      className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 font-semibold transition-all duration-300 transform hover:scale-105 rounded-lg flex flex-col items-center justify-center space-y-1 h-16 hover:bg-white"
                    >
                      <IconComponent className={`h-4 w-4 ${city.color} hover:!text-white`} />
                      <span className="text-xs">{city.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8 max-w-4xl">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <Medal className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Top Rated Chartered Accountants
              </h3>

              {isLoadingCAs ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(index => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700 h-80 animate-pulse"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                        <div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : featuredCAs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {featuredCAs.map(ca => (
                    <div
                      key={ca.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 flex flex-col h-80"
                      onClick={() => handleCAClick(ca.id)}
                    >
                      <div className="flex items-center mb-4">
                        <img
                          src={ca.imageUrl}
                          alt={ca.name}
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{ca.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{ca.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                            {ca.rating}
                          </span>
                          <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                            ({ca.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {ca.experience} years experience
                        </span>
                      </div>

                      <div className="mb-4 flex-grow">
                        <div className="flex flex-wrap gap-1">
                          {ca.services &&
                            ca.services.slice(0, 2).map((service, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                              >
                                {service}
                              </span>
                            ))}
                          {ca.services && ca.services.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              +{ca.services.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white mt-auto"
                        onClick={e => {
                          e.stopPropagation();
                          handleCAClick(ca.id);
                        }}
                      >
                        Connect Now
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No featured CAs available at the moment.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 max-w-4xl">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium">1000+ Verified CAs</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-700 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium">Secure Platform</span>
              </div>
            </div>
          </div>

          {/* Right Column - Accounting Background Design */}
          <div className="lg:col-span-1 relative hidden lg:block">
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-full opacity-30"></div>

              {/* Floating Icons */}
              <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calculator className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">Expert CA</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Services</p>
                  </div>
                </div>

                {/* Animated Service Labels */}
                <div
                  className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 dark:text-white">GST</span>
                  </div>
                </div>

                <div
                  className="absolute top-20 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-bounce"
                  style={{ animationDelay: "0.7s" }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Calculator className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 dark:text-white">
                      ITR Filing
                    </span>
                  </div>
                </div>

                <div
                  className="absolute bottom-24 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-bounce"
                  style={{ animationDelay: "1.2s" }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 dark:text-white">
                      Auditing
                    </span>
                  </div>
                </div>

                <div
                  className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-bounce"
                  style={{ animationDelay: "1.7s" }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <TrendUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 dark:text-white">
                      Investment
                    </span>
                  </div>
                </div>

                <div
                  className="absolute bottom-3 left-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-bounce"
                  style={{ animationDelay: "2.2s" }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                      <Rocket className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 dark:text-white">
                      Startup
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center">
          <ArrowDown className="h-6 w-6 text-gray-400 animate-pulse" />
          <span className="text-xs text-gray-400 mt-1">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 