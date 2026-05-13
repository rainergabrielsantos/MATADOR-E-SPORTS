import { NavLink } from "react-router";
import { Home, Users, Swords, Shield, Trophy, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useAuth } from "../hooks/useAuth";
import { NotificationHub } from "./NotificationHub";
import { Button } from "./ui/button";

export function LeftSidebar() {
  const { user, logout } = useAuth();
  
  const navItems = [
    { icon: Home,   label: "Home Dashboard",      path: "/dashboard" },
    user?.role === 'Member' 
      ? { icon: Trophy, label: "Coaching Hub",       path: "/dashboard/member-coaching" }
      : { icon: Trophy, label: "The Pro Pipeline",   path: "/dashboard/path-to-pro" },
    { icon: Users,  label: "Community Hub",        path: "/dashboard/community" },
    { icon: Swords, label: "Events & Scrimmages",  path: "/dashboard/events" },
  ];

  const teamItem = { icon: Shield, label: "Team Dashboard", path: "/dashboard/team" };

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
      <div className="p-6 border-b border-white/10 space-y-6">
        <div className="flex items-center justify-between">
           <NotificationHub />
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="h-10 w-10 text-[#a8b2bf] hover:text-[#CE1126] hover:bg-white/5 rounded-xl transition-all"
           >
             <LogOut className="h-5 w-5" />
           </Button>
        </div>

        <NavLink to="/dashboard/profile" className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors group">
          <Avatar className="h-14 w-14 ring-2 ring-[#CE1126] group-hover:scale-105 transition-transform">
            <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Matador'}`} />
            <AvatarFallback>{user?.username?.[0] || 'M'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-bold tracking-tight">{user?.username || 'Guest'}</p>
              <Badge className="bg-[#CE1126]/20 text-[#CE1126] hover:bg-[#CE1126]/20 text-[10px] border border-[#CE1126]/20 uppercase">
                {user?.role || 'Member'}
              </Badge>
            </div>
            <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-widest mt-0.5">ID: {user?.id?.slice(-8) || '00000000'}</p>
          </div>
        </NavLink>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-white/5 rounded-xl p-2.5 backdrop-blur-sm border border-white/5">
            <p className="text-[#CE1126] text-sm font-black">247</p>
            <p className="text-[9px] text-[#a8b2bf] uppercase font-bold tracking-tighter">Hours</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 backdrop-blur-sm border border-white/5">
            <p className="text-[#CE1126] text-sm font-black">32</p>
            <p className="text-[9px] text-[#a8b2bf] uppercase font-bold tracking-tighter">Matches</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/dashboard"}
            id={`nav-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
            className={linkClass}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}

        {/* Team Hub (For Players/Coaches) */}
        {user?.role !== 'Member' && (
          <NavLink
            to="/dashboard/team"
            id="nav-team-dashboard"
            className={linkClass}
          >
            <Shield className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left text-sm font-medium">Team Dashboard</span>
            <Badge variant="outline" className="text-[8px] uppercase border-blue-500/50 text-blue-400 font-black">
              Private
            </Badge>
          </NavLink>
        )}

        {/* Staff Tools Divider */}
        {user?.role === 'Coach' && (
          <>
            <div className="pt-4 pb-1">
              <div className="flex items-center gap-2 px-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[#a8b2bf] text-[10px] uppercase font-black tracking-[0.2em] opacity-40">Staff Control</span>
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
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                <Badge variant="outline" className="text-[8px] uppercase border-[#CE1126]/50 text-[#CE1126] font-black">
                  Admin
                </Badge>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <div className="flex flex-col items-center group">
          <img 
            src="/logo.png" 
            alt="Matador Esports Hub Logo" 
            className="h-16 w-auto opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
            onError={(e) => {
              // Fallback to text if logo is missing
              e.currentTarget.style.display = 'none';
              const next = e.currentTarget.nextElementSibling as HTMLElement;
              if (next) next.style.display = 'block';
              const prev = e.currentTarget.previousElementSibling as HTMLElement;
              if (prev) prev.style.display = 'block';
            }}
          />
          <div style={{ display: 'none' }}>
            <p className="text-[#CE1126] tracking-[0.3em] uppercase text-[10px] font-black mb-0.5">Matador</p>
            <p className="text-white tracking-[0.1em] uppercase text-xs font-black">Esports Hub</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
