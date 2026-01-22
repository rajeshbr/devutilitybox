import { Braces, Binary, ListChecks, Database, Clock, Sparkles } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Layout } from "@/components/Layout";

const tools = [
  
  {
    title: "JSON Editor",
    description: "Beautify, validate, and minify JSON data with syntax highlighting",
    icon: Braces,
    path: "/json-editor",
    gradient: "cyan" as const,
  },

  {
    title: "Base64 Encoder",
    description: "Encode and decode Base64 strings instantly",
    icon: Binary,
    path: "/base64",
    gradient: "pink" as const,
  },
  {
    title: "List Comparator",
    description: "Compare two lists and find common, unique, or missing items",
    icon: ListChecks,
    path: "/list-comparator",
    gradient: "orange" as const,
  },
  {
    title: "SQL Formatter",
    description: "Format and beautify SQL queries for better readability",
    icon: Database,
    path: "/sql-formatter",
    gradient: "purple" as const,
  },
  {
    title: "Timezone Converter",
    description: "Convert time between different world timezones instantly",
    icon: Clock,
    path: "/timezone",
    gradient: "cyan" as const,
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 text-center">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-gradient-cyan/20 to-gradient-pink/20 blur-3xl animate-float" />
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-gradient-to-br from-gradient-orange/20 to-gradient-yellow/20 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground mb-6">
          <Sparkles className="h-4 w-4 text-gradient-cyan" />
          Free developer utilities
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
          <span className="gradient-text">Developer</span>{" "}
          <span className="text-foreground">Tools</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-12">
          A collection of essential utilities for developers. Format JSON, encode Base64, 
          compare lists, and beautify SQL — all in one place.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-12 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">5</div>
            <div className="text-sm text-muted-foreground">Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text-secondary">100%</div>
            <div className="text-sm text-muted-foreground">Free</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">∞</div>
            <div className="text-sm text-muted-foreground">Usage</div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </section>
    </Layout>
  );
};

export default Index;
