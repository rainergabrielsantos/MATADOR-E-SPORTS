import { NavLink } from "react-router";
import { Home, Users, Swords, Shield, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export function LeftSidebar() {
  const navItems = [
    { icon: Home,   label: "Community Lounge",    path: "/dashboard" },
    { icon: Trophy, label: "The Pro Pipeline",     path: "/dashboard/path-to-pro" },
    { icon: Users,  label: "Community Hub",        path: "/dashboard/community" },
    { icon: Swords, label: "Events & Scrimmages",  path: "/dashboard/events" },
  ];

  const staffItems = [
    { icon: Shield, label: "Coach's Terminal", path: "/dashboard/coach-terminal" },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/30"
        : "text-[#a8b2bf] hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-[#0d0d12] border-r border-white/10 h-screen flex flex-col sticky top-0">
      {/* Profile Module */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-14 w-14 ring-2 ring-[#CE1126]">
            <AvatarImage src="https://images.unsplash.com/photo-1707396172424-f3293f788364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lciUyMGF2YXRhciUyMHByb2ZpbGUlMjBtYWxlfGVufDF8fHx8MTc3NTcxNzExNnww&ixlib=rb-4.1.0&q=80&w=1080" />
            <AvatarFallback>MX</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white tracking-wide">MatadorX</p>
              <Badge className="bg-[#CE1126] text-white hover:bg-[#CE1126]/90 text-xs">
                LVL 12
              </Badge>
            </div>
            <p className="text-xs text-[#a8b2bf]">CSUN ID: 012345678</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm">
            <p className="text-[#CE1126] font-bold">247</p>
            <p className="text-xs text-[#a8b2bf]">Hours</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm">
            <p className="text-[#CE1126] font-bold">32</p>
            <p className="text-xs text-[#a8b2bf]">Matches</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/"}
            id={`nav-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
            className={linkClass}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left text-sm">{item.label}</span>
          </NavLink>
        ))}

        {/* Staff Tools Divider */}
        <div className="pt-4 pb-1">
          <div className="flex items-center gap-2 px-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[#a8b2bf] text-xs uppercase tracking-widest">Staff</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>

        {staffItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            id={`nav-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/30"
                  : "text-[#a8b2bf] hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left text-sm">{item.label}</span>
            <Badge variant="outline" className="text-xs border-[#a8b2bf]/50">
              Staff
            </Badge>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-[#CE1126] tracking-widest uppercase text-xs mb-1">CSUN</p>
          <p className="text-white tracking-widest uppercase">E-SPORTS</p>
        </div>
      </div>
    </aside>
  );
}
