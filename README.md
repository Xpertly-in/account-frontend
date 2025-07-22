# Xpertly Account Frontend

The Xpertly Account Frontend is a modern web application built with Next.js that serves as the user interface for managing Chartered Accountant (CA) profiles and services. This platform enables users to search for and connect with qualified CAs based on their expertise and location.

## Features

- 🔍 Advanced CA Search: Find CAs based on location, expertise, and ratings
- 👤 CA Profiles: Detailed professional profiles with qualifications and services
- 📱 Responsive Design: Optimized for all devices and screen sizes
- 🎨 Modern UI: Built with Tailwind CSS and Shadcn UI components
- 🔒 Authentication: Secure user authentication and authorization
- ⚡ Performance: Optimized for fast loading and smooth user experience

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: Jotai
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Analytics**: Google Analytics 4 (GA4)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:Xpertly-in/account-frontend.git
   cd account-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory and add the required environment variables:

   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga4_measurement_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

