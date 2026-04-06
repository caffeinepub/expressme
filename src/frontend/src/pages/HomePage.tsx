import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  MessageSquare,
  Sparkles,
  Star,
  UserCircle,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PostCard, { PostCardSkeleton } from "../components/PostCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetFeed } from "../hooks/useQueries";
import { samplePosts } from "../lib/sampleData";

const HIGHLIGHTS = [
  {
    icon: MessageSquare,
    title: "Forum Hub",
    description:
      "Dive into discussions about topics you care about — from school life to hobbies and everything in between.",
    color: "bg-pastel-mint",
    iconColor: "text-green-600",
  },
  {
    icon: Sparkles,
    title: "Share Creations",
    description:
      "Post your writing, artwork, thoughts, and ideas. Express yourself and inspire others in the community.",
    color: "bg-pastel-lavender",
    iconColor: "text-purple-600",
  },
  {
    icon: UserCircle,
    title: "Your Profile",
    description:
      "Build your unique profile, showcase your posts, and connect with students who share your interests.",
    color: "bg-pastel-peach",
    iconColor: "text-orange-600",
  },
];

const COMMUNITY_STARS = [
  { name: "Maya K.", posts: 12, badge: "Top Contributor" },
  { name: "Alex T.", posts: 9, badge: "Active Discusser" },
  { name: "Zoe P.", posts: 7, badge: "Creative Star" },
];

const HOME_SKELETON_KEYS = ["hs-a", "hs-b", "hs-c"];

export default function HomePage() {
  const { data: feedData, isLoading } = useGetFeed();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const principal = identity?.getPrincipal() ?? null;
  const posts = (
    feedData && feedData.length > 0 ? feedData : samplePosts
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="bg-background py-12 md:py-20"
          data-ocid="home.section"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-primary/10 text-primary text-xs font-semibold mb-5">
                  <Star className="w-3.5 h-3.5" />A safe space for students
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
                  Welcome to <span className="text-primary">ExpressMe</span>!
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                  A safe space to share your ideas and feelings. Connect,
                  discuss, and grow with students just like you.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="rounded-pill px-7"
                    onClick={() => navigate({ to: "/forum" })}
                    data-ocid="home.primary_button"
                  >
                    Start Exploring
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-pill px-7 border-primary/30 text-primary hover:bg-primary/5"
                    onClick={() =>
                      navigate({ to: "/login", search: { tab: "signup" } })
                    }
                    data-ocid="home.secondary_button"
                  >
                    Join Now
                  </Button>
                </div>
              </motion.div>

              {/* Right — Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex justify-center"
              >
                <div className="relative w-full max-w-md">
                  <div className="rounded-3xl overflow-hidden shadow-card bg-card p-2">
                    <img
                      src="/assets/generated/hero-students.dim_600x480.png"
                      alt="Students expressing themselves"
                      className="rounded-2xl w-full object-cover"
                    />
                  </div>
                  {/* Floating badges */}
                  <div className="absolute -bottom-4 -left-4 bg-card shadow-card rounded-2xl px-4 py-2.5 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      1,200+ students
                    </span>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-card shadow-card rounded-2xl px-4 py-2.5 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-semibold text-foreground">
                      800+ discussions
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-14 bg-card" data-ocid="home.highlights.section">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                ExpressMe Highlights
              </h2>
              <p className="text-muted-foreground mt-2">
                Everything you need to connect and express yourself
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6">
              {HIGHLIGHTS.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className={`rounded-2xl p-6 shadow-card ${h.color}`}
                  data-ocid={`home.highlights.item.${i + 1}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center mb-4 ${h.iconColor}`}
                  >
                    <h.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{h.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {h.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Posts + Community Stars */}
        <section className="py-14" data-ocid="home.recent.section">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Recent Activity
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-pill border-primary/30 text-primary hover:bg-primary/5"
                    onClick={() => navigate({ to: "/forum" })}
                    data-ocid="home.forum.link"
                  >
                    View all
                  </Button>
                </div>

                <div className="space-y-4" data-ocid="home.recent.list">
                  {isLoading
                    ? HOME_SKELETON_KEYS.map((k) => (
                        <PostCardSkeleton key={k} />
                      ))
                    : posts.map((post, i) => (
                        <PostCard
                          key={post.id.toString()}
                          post={post}
                          index={i}
                          compact={false}
                          currentPrincipal={principal}
                        />
                      ))}
                  {!isLoading && posts.length === 0 && (
                    <div
                      className="text-center py-10 text-muted-foreground"
                      data-ocid="home.recent.empty_state"
                    >
                      No posts yet. Be the first to share something!
                    </div>
                  )}
                </div>
              </div>

              {/* Community Stars */}
              <aside>
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Community Stars
                </h2>
                <div
                  className="bg-card rounded-2xl shadow-card p-5 space-y-4"
                  data-ocid="home.stars.card"
                >
                  {COMMUNITY_STARS.map((star, i) => (
                    <div
                      key={star.name}
                      className="flex items-center gap-3"
                      data-ocid={`home.stars.item.${i + 1}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">
                          {star.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {star.posts} posts
                        </p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-pill">
                        {star.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
