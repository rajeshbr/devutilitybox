import { Link, useLocation } from "react-router-dom";
import { Braces, Binary, ListChecks, Database, Clock, Moon, Sun, Github, Code, Key, Twitter, Linkedin, Facebook, Mail } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

const tools = [
  /*{ path: "/json-formatter", name: "JSON", icon: Braces, color: "cyan" },*/
  { path: "/json-editor", name: "JSON Editor", icon: Braces, color: "cyan" },
  { path: "/base64", name: "Base64", icon: Binary, color: "pink" },
  { path: "/list-comparator", name: "Lists", icon: ListChecks, color: "orange" },
  { path: "/sql-formatter", name: "SQL", icon: Database, color: "purple" },
  { path: "/timezone", name: "Timezone", icon: Clock, color: "cyan" },
  { path: "/code-editor", name: "Code", icon: Code, color: "blue" },
  { path: "/jwt-decoder", name: "JWT", icon: Key, color: "cyan" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gradient-cyan to-gradient-pink" />
            <span className="text-xl font-bold gradient-text">DevUtilityBox.com</span>
          </Link>

          <nav className="flex items-center gap-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = location.pathname === tool.path;
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tool.name}</span>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-2"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            <a
              href="https://github.com/rajeshbr/devutilitybox"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                title="View on GitHub"
              >
                <Github className="h-4 w-4" />
              </Button>
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/30 mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">DevUtilityBox</h3>
              <p className="text-sm text-muted-foreground">
                Free, privacy-first developer utilities. All tools run locally in your browser.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/PRIVACY_POLICY.md" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/COOKIE_POLICY.md" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="https://github.com/rajeshbr/devutilitybox" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Share */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Share</h3>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/intent/tweet?text=Check%20out%20DevUtilityBox%20-%20free%20developer%20utilities%20for%20everyone&url=https://devutilitybox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Twitter"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </a>
                <a
                  href="https://www.linkedin.com/sharing/share-offsite/?url=https://devutilitybox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on LinkedIn"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </a>
                <a
                  href="https://www.facebook.com/sharer/sharer.php?u=https://devutilitybox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Facebook"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </a>
                <a
                  href="mailto:?subject=Check%20out%20DevUtilityBox&body=I%20found%20this%20great%20collection%20of%20free%20developer%20utilities%3A%20https%3A%2F%2Fdevutilitybox.com"
                  title="Share via Email"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mail className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border/40 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 DevUtilityBox. All rights reserved.</p>
            <p>Made with ❤️ for developers, by developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
