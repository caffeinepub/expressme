import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "Home", href: "/" as const },
  { label: "Forum", href: "/forum" as const },
  { label: "Upload", href: "/upload" as const },
  { label: "Profile", href: "/profile" as const },
];

export default function Header() {
  const { identity, clear } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header
      className="sticky top-0 z-50 bg-card shadow-header"
      data-ocid="header.panel"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
            data-ocid="nav.home.link"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">
              ExpressMe
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className={cn(
                  "px-4 py-2 rounded-pill text-sm font-medium transition-colors",
                  currentPath === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-pill"
                onClick={() => clear()}
                data-ocid="header.logout_button"
              >
                Log Out
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-pill border-primary/30 text-primary hover:bg-primary/5"
                >
                  <Link to="/login" data-ocid="header.login.link">
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-pill">
                  <Link
                    to="/login"
                    search={{ tab: "signup" }}
                    data-ocid="header.signup.link"
                  >
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="header.menu.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    currentPath === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 px-4 pt-2">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-pill w-full"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    data-ocid="header.mobile.logout_button"
                  >
                    Log Out
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-pill flex-1"
                    >
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        data-ocid="header.mobile.login.link"
                      >
                        Login
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-pill flex-1">
                      <Link
                        to="/login"
                        search={{ tab: "signup" }}
                        onClick={() => setMobileOpen(false)}
                        data-ocid="header.mobile.signup.link"
                      >
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
