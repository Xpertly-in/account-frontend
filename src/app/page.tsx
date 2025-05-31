"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/features/search";
import { Container } from "@/components/layout/Container.component";
import { Feed } from "@/components/features/feed/Feed.component";
import { supabase } from "@/lib/supabase";

interface PostCardProps {
  id: string;
  updated_at: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  category: string;
  tags: string[];
  images: string[];
  reaction_counts: Record<string, number>;
  is_deleted: boolean;
}

export default function Home() {

  const [latestPosts, setLatestPosts] = useState<PostCardProps[]>([]);
  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
            id,
            title,
            content,
            category,
            tags,
            images,
            reaction_counts,
            updated_at,
            is_deleted,
            author_id,
            profiles (
              name,
              profile_picture
            )
          `
        )
        .eq("is_deleted", false)
        .order("updated_at", { ascending: false })
        .limit(3);
      if (!error && data) {
        setLatestPosts(
          data.map((p: any) => ({
            id: p.id,
            updated_at: p.updated_at,
            title: p.title,
            content: p.content,
            author_id: p.author_id,
            author_name: p.profiles.name,
            author_avatar: p.profiles.profile_picture,
            category: p.category,
            tags: p.tags,
            images: p.images,
            reaction_counts: p.reaction_counts,
            is_deleted: p.is_deleted,
          }))
        );
      }
    };
    fetchLatest();
  }, []);

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-b from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-blue-800/50 dark:to-gray-900 relative overflow-hidden">
        {/* Decorative patterns and glows */}
        <div className="absolute inset-0 bg-pattern opacity-40 dark:opacity-30"></div>

        {/* Light mode glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-200 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3 dark:opacity-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300 to-green-200 rounded-full filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/2 dark:opacity-0"></div>

        {/* Dark mode glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full filter blur-3xl opacity-0 -translate-y-1/2 translate-x-1/3 dark:opacity-30"></div>
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full filter blur-3xl opacity-0 -translate-x-1/2 dark:opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-full filter blur-3xl opacity-0 translate-y-1/2 dark:opacity-15"></div>

        <Container className="py-20 md:py-28 lg:py-32 relative z-10">
          <section className="space-y-8 md:space-y-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-800/50 dark:text-blue-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Find experts that match your needs
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto dark:text-white">
                Find Your Perfect{" "}
                <span className="relative">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-blue-400 dark:to-blue-300">
                    Chartered Accountant
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-3 bg-blue-100 dark:bg-blue-700/50 opacity-50 rounded-lg -z-10"></span>
                </span>
              </h1>
              <p className="max-w-2xl text-xl text-gray-600 md:text-2xl dark:text-blue-100">
                Connect with verified CAs in your area for all your financial needs
              </p>
            </div>
            <div className="mx-auto mt-12 w-full">
              <SearchBar />
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
