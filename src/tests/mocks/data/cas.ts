import { CA } from "@/types/ca.type";

// Create mock CA data
export const mockCAs: CA[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    location: "Mumbai",
    rating: 4.8,
    reviews: 127,
    verified: true,
    specialization: ["Tax Planning", "Audit", "GST Filing"],
    experience: 10,
    imageUrl: "/images/ca-profile-1.jpg",
  },
  {
    id: "2",
    name: "Priya Patel",
    location: "Delhi",
    rating: 4.5,
    reviews: 93,
    verified: true,
    specialization: ["Corporate Finance", "Business Valuation"],
    experience: 8,
    imageUrl: "/images/ca-profile-2.jpg",
  },
  {
    id: "3",
    name: "Amit Kumar",
    location: "Bangalore",
    rating: 4.2,
    reviews: 45,
    verified: false,
    specialization: ["Startup Advisory", "Financial Planning"],
    experience: 5,
    imageUrl: "/images/ca-profile-3.jpg",
  },
];
