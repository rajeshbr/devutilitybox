import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient: "cyan" | "pink" | "orange" | "purple";
}

const gradientClasses = {
  cyan: {
    card: "tool-card-cyan",
    bgGradient: "from-cyan-400 to-blue-400",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200",
  },
  pink: {
    card: "tool-card-pink",
    bgGradient: "from-pink-400 to-purple-400",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-200",
  },
  orange: {
    card: "tool-card-orange",
    bgGradient: "from-orange-400 to-yellow-400",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200",
  },
  purple: {
    card: "tool-card-purple",
    bgGradient: "from-purple-400 to-pink-400",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200",
  },
};

export function ToolCard({ title, description, icon: Icon, path, gradient }: ToolCardProps) {
  const classes = gradientClasses[gradient];

  return (
    <Link to={path} className={`tool-card ${classes.card} group block`}>
      {/* Gradient decoration */}
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${classes.bgGradient} opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20 group-hover:blur-3xl`}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${classes.bgGradient}`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>

        {/* Content */}
        <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>

        {/* Arrow indicator */}
        <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          Open tool
          <svg
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
