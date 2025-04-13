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
- **State Management**: React Context + Hooks
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)

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

## Project Structure

```
src/
├── app/                 # App router pages and layouts
├── components/          # Reusable UI components
├── lib/                 # Utility functions and configurations
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Shadcn UI Documentation](https://ui.shadcn.com/) - Re-usable components
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript language reference

## Deployment

The application is deployed on Vercel. For more information about deploying Next.js apps, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
