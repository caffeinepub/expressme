import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" as const },
  { label: "Forum", href: "/forum" as const },
  { label: "Upload", href: "/upload" as const },
  { label: "Profile", href: "/profile" as const },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const caffeine = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-footer text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">ExpressMe</span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/50">
          © {year}. Built with{" "}
          <Heart className="inline w-3.5 h-3.5 text-pink-400 fill-pink-400 mx-0.5" />{" "}
          using{" "}
          <a
            href={caffeine}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white underline underline-offset-2 transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
