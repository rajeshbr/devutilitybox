import { Link, useLocation } from "react-router-dom";
import { Braces, Binary, ListChecks, Database, Clock, Moon, Sun, Github, Code, Key } from "lucide-react";
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
    </div>
  );
}
