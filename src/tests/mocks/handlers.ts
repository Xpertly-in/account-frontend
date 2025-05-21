import { http, HttpResponse } from "msw";
import { CA } from "@/types/ca.type";

// Mock CA data
const mockCAs: CA[] = [
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

// Mock user data
const mockUser = {
  id: "mock-user-id",
  email: "test@example.com",
  app_metadata: {
    provider: "email",
  },
  user_metadata: {
    name: "Test User",
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  role: "authenticated",
};

export const handlers = [
  // Auth handlers
  http.post("*/auth/v1/token", () => {
    return HttpResponse.json({
      access_token: "mock-access-token",
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token",
      user: mockUser,
    });
  }),

  http.post("*/auth/v1/signup", () => {
    return HttpResponse.json({
      id: "mock-user-id",
      email: "test@example.com",
      aud: "authenticated",
      role: "authenticated",
      email_confirmed_at: new Date().toISOString(),
    });
  }),

  // CA Profile handlers
  http.get("*/rest/v1/profiles", () => {
    return HttpResponse.json(mockCAs);
  }),

  http.get("*/rest/v1/profiles/:id", ({ params }) => {
    const { id } = params;
    const ca = mockCAs.find((profile: CA) => profile.id === id);

    if (!ca) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(ca);
  }),

  // Search handlers
  http.get("*/rest/v1/search_cas", ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";
    const location = url.searchParams.get("location") || "";

    const filteredCAs = mockCAs.filter((profile: CA) => {
      const matchesQuery =
        !query ||
        profile.name.toLowerCase().includes(query.toLowerCase()) ||
        profile.specialization.some((specialization: string) =>
          specialization.toLowerCase().includes(query.toLowerCase())
        );

      const matchesLocation =
        !location || profile.location.toLowerCase().includes(location.toLowerCase());

      return matchesQuery && matchesLocation;
    });

    return HttpResponse.json(filteredCAs);
  }),
];
