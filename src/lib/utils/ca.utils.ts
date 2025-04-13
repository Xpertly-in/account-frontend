import { CAData } from "@/types/ca.type";

// Sample CA data for demonstration
export const mockCAs: CAData[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    location: "Mumbai, Maharashtra",
    rating: 4.8,
    reviews: 42,
    verified: true,
    specialization: ["Taxation", "Audit"],
    experience: 12,
  },
  {
    id: "2",
    name: "Priya Sharma",
    location: "Delhi, NCR",
    rating: 4.5,
    reviews: 28,
    verified: true,
    specialization: ["GST", "Corporate Finance"],
    experience: 8,
  },
  {
    id: "3",
    name: "Ankit Patel",
    location: "Bangalore, Karnataka",
    rating: 4.7,
    reviews: 35,
    verified: false,
    specialization: ["Business Consulting", "Wealth Management"],
    experience: 10,
  },
  {
    id: "4",
    name: "Meera Joshi",
    location: "Chennai, Tamil Nadu",
    rating: 4.9,
    reviews: 51,
    verified: true,
    specialization: ["Tax Planning", "Startup Advisory"],
    experience: 15,
  },
];
