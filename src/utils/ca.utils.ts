import { CAProfile, FeaturedCA } from "@/types/ca.type";

// Mock CA data - in a real app this would come from an API
export const mockCAData: Record<string, CAProfile> = {
  "1": {
    id: "1",
    name: "CA Rajesh Sharma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    experience: 12,
    rating: 4.8,
    totalReviews: 156,
    location: "Mumbai, Maharashtra",
    services: ["GST Filing", "Income Tax Returns", "Tax Audit", "Corporate Compliance", "Investment Planning", "Business Registration"],
    education: [
      { degree: "Chartered Accountancy", institution: "ICAI", year: "2012" },
      { degree: "B.Com", institution: "Mumbai University", year: "2010" }
    ],
    workExperience: [
      { company: "Ernst & Young", position: "Senior Tax Consultant", duration: "2018-2023" },
      { company: "KPMG", position: "Tax Associate", duration: "2014-2018" },
      { company: "Deloitte", position: "Junior Auditor", duration: "2012-2014" }
    ],
    reviews: [
      { name: "Amit Patel", rating: 5, comment: "Excellent service for GST filing. Very professional and timely.", date: "2024-01-15" },
      { name: "Priya Singh", rating: 4, comment: "Helped me with tax planning. Good knowledge and patient explanations.", date: "2024-01-10" },
      { name: "Rohit Kumar", rating: 5, comment: "Outstanding work on company audit. Highly recommended!", date: "2024-01-05" }
    ],
    aboutMe: "With over 12 years of experience in taxation and auditing, I specialize in helping businesses and individuals navigate complex financial regulations. My expertise includes GST compliance, income tax planning, and corporate auditing."
  },
  "2": {
    id: "2",
    name: "CA Priya Patel",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    experience: 8,
    rating: 4.9,
    totalReviews: 203,
    location: "Delhi, NCR",
    services: ["Corporate Tax", "Investment Planning", "Compliance", "Financial Advisory", "Startup Consulting", "Mergers & Acquisitions"],
    education: [
      { degree: "Chartered Accountancy", institution: "ICAI", year: "2016" },
      { degree: "MBA Finance", institution: "Delhi School of Economics", year: "2014" }
    ],
    workExperience: [
      { company: "PwC", position: "Tax Manager", duration: "2020-2024" },
      { company: "Grant Thornton", position: "Senior Associate", duration: "2017-2020" },
      { company: "BDO India", position: "Associate", duration: "2016-2017" }
    ],
    reviews: [
      { name: "Vikash Gupta", rating: 5, comment: "Exceptional investment planning advice. Helped optimize my portfolio.", date: "2024-01-20" },
      { name: "Neha Sharma", rating: 5, comment: "Professional approach to corporate compliance. Highly satisfied.", date: "2024-01-18" },
      { name: "Ravi Agarwal", rating: 4, comment: "Good expertise in startup consulting. Valuable insights provided.", date: "2024-01-12" }
    ],
    aboutMe: "Specializing in corporate taxation and investment advisory, I help businesses optimize their financial strategies. My focus is on providing comprehensive solutions for startups and established enterprises."
  },
  "3": {
    id: "3",
    name: "CA Amit Kumar",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    experience: 15,
    rating: 4.7,
    totalReviews: 98,
    location: "Bangalore, Karnataka",
    services: ["GST Returns", "TDS Filing", "Business Setup", "Statutory Audit", "Internal Audit", "Risk Management"],
    education: [
      { degree: "Chartered Accountancy", institution: "ICAI", year: "2009" },
      { degree: "B.Com (Hons)", institution: "Bangalore University", year: "2007" }
    ],
    workExperience: [
      { company: "Independent Practice", position: "Chartered Accountant", duration: "2015-Present" },
      { company: "RSM India", position: "Audit Manager", duration: "2012-2015" },
      { company: "S.R. Batliboi & Co.", position: "Senior Associate", duration: "2009-2012" }
    ],
    reviews: [
      { name: "Sunita Reddy", rating: 5, comment: "Excellent audit services. Very thorough and detail-oriented.", date: "2024-01-25" },
      { name: "Kiran Shetty", rating: 4, comment: "Helped with business setup. Good guidance throughout the process.", date: "2024-01-22" },
      { name: "Manoj Jain", rating: 5, comment: "Reliable for GST returns filing. Always meets deadlines.", date: "2024-01-20" }
    ],
    aboutMe: "With 15 years of comprehensive experience in auditing and taxation, I provide end-to-end financial solutions. My expertise spans across statutory compliance, business advisory, and risk management."
  }
};

export const featuredCAs: FeaturedCA[] = [
  {
    id: 1,
    name: "CA Rajesh Sharma",
    experience: 12,
    rating: 4.8,
    reviews: 156,
    services: ["GST Filing", "Income Tax", "Audit"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "Mumbai"
  },
  {
    id: 2,
    name: "CA Priya Patel",
    experience: 8,
    rating: 4.9,
    reviews: 203,
    services: ["Corporate Tax", "Investment Planning", "Compliance"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    location: "Delhi"
  },
  {
    id: 3,
    name: "CA Amit Kumar",
    experience: 15,
    rating: 4.7,
    reviews: 98,
    services: ["GST Returns", "TDS Filing", "Business Setup"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "Bangalore"
  }
];

// Utility functions
export const getCAProfile = (id: string): CAProfile | null => {
  return mockCAData[id] || null;
};

export const getAllCAProfiles = (): CAProfile[] => {
  return Object.values(mockCAData);
};

export const searchCAs = (query: string, location?: string): CAProfile[] => {
  const allCAs = getAllCAProfiles();
  
  return allCAs.filter(ca => {
    const matchesQuery = query 
      ? ca.name.toLowerCase().includes(query.toLowerCase()) ||
        ca.services.some(service => service.toLowerCase().includes(query.toLowerCase()))
      : true;
    
    const matchesLocation = location 
      ? ca.location.toLowerCase().includes(location.toLowerCase())
      : true;
    
    return matchesQuery && matchesLocation;
  });
};

export const getFeaturedCAs = (): FeaturedCA[] => {
  return featuredCAs;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatExperience = (years: number): string => {
  return `${years} year${years !== 1 ? 's' : ''} experience`;
};

export const getAverageRating = (reviews: { rating: number }[]): number => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}; 