import { NavLink } from "react-router-dom";
import { Home, Calendar, Dumbbell, BarChart3, Settings } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/planner", label: "Planner", icon: Dumbbell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Navbar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-pine/10
                 bg-paper/95 py-2 backdrop-blur dark:bg-dusk-card/95 dark:border-paper/10
                 sm:static sm:justify-start sm:gap-8 sm:border-b sm:border-t-0 sm:bg-transparent sm:px-6 sm:py-4"
    >
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium sm:flex-row sm:text-sm ${
              isActive ? "text-ember" : "text-pine/60 dark:text-paper/50"
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
