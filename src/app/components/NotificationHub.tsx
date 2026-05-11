import { useState } from "react";
import { 
  Bell, 
  MessageSquare, 
  Trophy, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  ExternalLink
} from "lucide-react";
import { useNotifications, Notification } from "../hooks/useNotifications";
import { Button } from "./ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "./ui/popover";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

export function NotificationHub() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications();

  const [filter, setFilter] = useState<Notification["type"] | "all">("all");

  const filteredNotifications = notifications.filter(n => filter === "all" || n.type === filter);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message": return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case "ticket": return <Trophy className="h-4 w-4 text-[#CE1126]" />;
      case "announcement": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4 text-[#CE1126]" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 text-[#a8b2bf] hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <Bell className={`h-5 w-5 transition-transform ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CE1126] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CE1126]"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-85 bg-[#131318]/80 backdrop-blur-xl border-white/10 p-0 shadow-2xl overflow-hidden rounded-2xl" align="end" side="right" sideOffset={10}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h3 className="text-sm font-bold uppercase italic tracking-wider flex items-center gap-2">
            Alert <span className="text-[#CE1126]">Center</span>
          </h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={markAllAsRead} className="h-7 w-7 text-[#a8b2bf] hover:text-white" title="Mark all as read">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={clearNotifications} className="h-7 w-7 text-[#a8b2bf] hover:text-[#CE1126]" title="Clear all">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", "message", "ticket", "announcement"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                filter === t 
                ? 'bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/20' 
                : 'text-white/30 hover:text-white hover:bg-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <ScrollArea className="h-[350px]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] px-8 text-center space-y-4">
              <div className="relative">
                <img 
                  src="/assets/no-notifications.png" 
                  alt="No notifications" 
                  className="h-24 w-24 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131318] to-transparent" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40">Comms are clear</p>
                <p className="text-[9px] text-[#a8b2bf] leading-relaxed max-w-[180px]">
                  No {filter !== 'all' ? filter : ''} alerts at the moment. Stand by for team updates.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredNotifications.map((n) => (
                <div 
                  key={n.id} 
                  role="button"
                  aria-label={`Notification: ${n.title}`}
                  className={`p-4 hover:bg-white/[0.05] transition-colors relative group cursor-pointer ${!n.read ? 'bg-[#CE1126]/[0.02]' : ''}`}
                  onClick={() => markAsRead(n.id)}
                >
                  {!n.read && (
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#CE1126] rounded-r-full" />
                  )}
                  <div className="flex gap-3">
                    <div className="mt-0.5 p-2 bg-white/5 rounded-lg">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-xs font-bold leading-none ${n.read ? 'text-white/60' : 'text-white'}`}>
                          {n.title}
                        </p>
                        <span className="text-[8px] uppercase font-bold text-white/20 tracking-tighter whitespace-nowrap ml-2">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#a8b2bf] line-clamp-2 leading-relaxed mb-2">
                        {n.content}
                      </p>
                      {n.link && (
                        <div className="flex items-center gap-1 text-[9px] text-[#CE1126] font-bold uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                          View Details <ExternalLink className="h-2 w-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 bg-white/[0.02] border-t border-white/10 text-center">
          <p className="text-[9px] text-white/20 uppercase font-bold tracking-tighter">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
