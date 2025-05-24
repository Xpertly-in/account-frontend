"use client";

import { SearchBar } from "@/components/features/search";
import { Container } from "@/components/layout/Container.component";
import { Button } from "@/ui/Button.ui";
import { ShieldCheck, Lightning, Funnel } from "@phosphor-icons/react";
import Link from "next/link";
import { ForumFeed } from "@/components/features/forum/ForumFeed.component";

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<PostCardProps[]>([]);
  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
            id,
            title,
            content,
            category,
            tags,
            images,
            likes_count,
            comment_count,
            updated_at,
            is_deleted,
            author_id,
            profiles (
              name,
              profile_picture
            )
          `)
        .eq("is_deleted", false)
        .order("updated_at", { ascending: false })
        .limit(3);
      if (!error && data) {
        setLatestPosts(
          data.map(p => ({
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
            likes_count: p.likes_count,
            comment_count: p.comment_count,
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

      {/* Forum Feed Section */}
      <ForumFeed />

      {/* Features Section */}
      <Container className="py-16 md:py-24">
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-300 inline-block">
            Why Choose Xpertly?
          </h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group dark:bg-gray-800 dark:shadow-blue-900/10">
              <div className="bg-gradient-to-r from-primary to-blue-500 dark:from-blue-600 dark:to-blue-500 p-6">
                <div className="bg-white dark:bg-gray-900 rounded-full p-4 h-16 w-16 flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                  <ShieldCheck className="h-8 w-8 text-primary dark:text-blue-400" weight="bold" />
                </div>
              </div>
              <div className="p-6 flex-1 border-t-0 border-b-4 border-l-0 border-r-0 border-primary dark:border-blue-500">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  Verified Professionals
                </h3>
                <p className="text-gray-700 text-lg dark:text-gray-300">
                  All CAs on our platform are verified with proper credentials and expertise.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group dark:bg-gray-800 dark:shadow-blue-900/10">
              <div className="bg-gradient-to-r from-primary to-blue-500 dark:from-blue-600 dark:to-blue-500 p-6">
                <div className="bg-white dark:bg-gray-900 rounded-full p-4 h-16 w-16 flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                  <Lightning className="h-8 w-8 text-primary dark:text-blue-400" weight="bold" />
                </div>
              </div>
              <div className="p-6 flex-1 border-t-0 border-b-4 border-l-0 border-r-0 border-primary dark:border-blue-500">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  Direct Connect
                </h3>
                <p className="text-gray-700 text-lg dark:text-gray-300">
                  Connect directly with CAs without any intermediaries or hidden fees.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group dark:bg-gray-800 dark:shadow-blue-900/10">
              <div className="bg-gradient-to-r from-primary to-blue-500 dark:from-blue-600 dark:to-blue-500 p-6">
                <div className="bg-white dark:bg-gray-900 rounded-full p-4 h-16 w-16 flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                  <Funnel className="h-8 w-8 text-primary dark:text-blue-400" weight="bold" />
                </div>
              </div>
              <div className="p-6 flex-1 border-t-0 border-b-4 border-l-0 border-r-0 border-primary dark:border-blue-500">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  Specialized Services
                </h3>
                <p className="text-gray-700 text-lg dark:text-gray-300">
                  Find CAs specializing in various fields from taxation to audit and beyond.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary via-blue-700 to-blue-600 dark:from-blue-800 dark:via-blue-700 dark:to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-blue-200 rounded-full filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300 to-green-200 rounded-full filter blur-3xl opacity-10 translate-y-1/3 -translate-x-1/2"></div>

        <Container className="py-20 md:py-28 relative z-10">
          <section>
            <div className="max-w-3xl mx-auto text-center">
              <span className="bg-white/20 text-white uppercase text-sm font-bold tracking-wider py-1 px-3 rounded-full mb-6 inline-block">
                For Professionals
              </span>
              <h2 className="text-4xl font-bold md:text-5xl text-white mb-4">
                Are you a Chartered Accountant?
              </h2>
              <p className="mt-4 text-xl text-blue-100 md:text-2xl max-w-2xl mx-auto">
                Register on our platform to expand your client base and grow your practice.
              </p>
              <div className="mt-10">
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-blue-50 hover:text-blue-800 px-10 py-7 text-xl font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-blue-100 dark:text-blue-800 dark:hover:bg-white"
                >
                  <Link href="/ca/register">Register as CA</Link>
                </Button>
              </div>
            </div>
          </section>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
      </div>
    </>
  );
}
