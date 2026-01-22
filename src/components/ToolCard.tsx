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
    icon: "from-gradient-cyan to-gradient-blue",
    badge: "bg-gradient-cyan/10 text-gradient-cyan",
  },
  pink: {
    card: "tool-card-pink",
    icon: "from-gradient-pink to-gradient-purple",
    badge: "bg-gradient-pink/10 text-gradient-pink",
  },
  orange: {
    card: "tool-card-orange",
    icon: "from-gradient-orange to-gradient-yellow",
    badge: "bg-gradient-orange/10 text-gradient-orange",
  },
  purple: {
    card: "tool-card-purple",
    icon: "from-gradient-purple to-gradient-pink",
    badge: "bg-gradient-purple/10 text-gradient-purple",
  },
};

export function ToolCard({ title, description, icon: Icon, path, gradient }: ToolCardProps) {
  const classes = gradientClasses[gradient];

  return (
    <Link to={path} className={`tool-card ${classes.card} group block`}>
      {/* Gradient decoration */}
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${classes.icon} opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20 group-hover:blur-3xl`}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${classes.icon}`}
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
