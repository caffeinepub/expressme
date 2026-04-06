import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PostCard, { PostCardSkeleton } from "../components/PostCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetFeed } from "../hooks/useQueries";
import { samplePosts } from "../lib/sampleData";

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d"];

export default function ForumPage() {
  const { data: feedData, isLoading } = useGetFeed();
  const { identity } = useInternetIdentity();
  const [search, setSearch] = useState("");

  const principal = identity?.getPrincipal() ?? null;
  const rawPosts = feedData && feedData.length > 0 ? feedData : samplePosts;
  const posts = rawPosts.filter(
    (p) =>
      search.trim() === "" ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1
              className="text-3xl font-bold text-foreground mb-2"
              data-ocid="forum.page"
            >
              Popular Discussions
            </h1>
            <p className="text-muted-foreground mb-6">
              Explore what students are talking about
            </p>

            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts or people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-pill bg-card border-border h-11"
                data-ocid="forum.search_input"
              />
            </div>
          </motion.div>

          {/* Posts */}
          <div className="space-y-5" data-ocid="forum.list">
            {isLoading
              ? SKELETON_KEYS.map((k) => <PostCardSkeleton key={k} />)
              : posts.map((post, i) => (
                  <motion.div
                    key={post.id.toString()}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <PostCard
                      post={post}
                      index={i}
                      currentPrincipal={principal}
                    />
                  </motion.div>
                ))}

            {!isLoading && posts.length === 0 && (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="forum.empty_state"
              >
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No posts found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
