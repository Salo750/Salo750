import { Link, NavLink, useLocation } from "react-router-dom";
import { Hammer, LayoutDashboard, PlusCircle, Home } from "lucide-react";

const linkBase =
  "flex items-center gap-2 px-3 py-2 text-sm font-medium tracking-wide uppercase transition-colors rounded-sm";

export const Navbar = () => {
  const loc = useLocation();
  const nav = [
    { to: "/", label: "Home", icon: Home, testid: "nav-home" },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard" },
    { to: "/capture", label: "Capture Lead", icon: PlusCircle, testid: "nav-capture" },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur"
      data-testid="app-navbar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" data-testid="brand-link" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-9 h-9 bg-orange-500 text-zinc-950 rounded-sm group-hover:bg-orange-400 transition-colors">
            <Hammer className="w-5 h-5" strokeWidth={2.5} />
          </span>
          <span className="font-display font-black text-xl tracking-tight uppercase text-zinc-50">
            Local<span className="text-orange-500">Ops</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((n) => {
            const active = loc.pathname === n.to || (n.to !== "/" && loc.pathname.startsWith(n.to));
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                data-testid={n.testid}
                className={`${linkBase} ${
                  active
                    ? "text-orange-500 bg-zinc-900"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{n.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
