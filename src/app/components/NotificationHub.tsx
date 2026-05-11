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
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CE1126] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CE1126]"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-[#131318] border-white/10 p-0 shadow-2xl overflow-hidden" align="end" side="right" sideOffset={10}>
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

        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-[#a8b2bf] space-y-2">
              <Bell className="h-8 w-8 opacity-10" />
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 hover:bg-white/[0.02] transition-colors relative group cursor-pointer ${!n.read ? 'bg-white/[0.01]' : ''}`}
                  onClick={() => markAsRead(n.id)}
                >
                  {!n.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CE1126]" />
                  )}
                  <div className="flex gap-3">
                    <div className="mt-0.5">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-none mb-1 ${n.read ? 'text-white/60' : 'text-white'}`}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-[#a8b2bf] line-clamp-2 leading-relaxed mb-2">
                        {n.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] uppercase font-bold text-white/20 tracking-tighter">
                          {new Date(n.createdAt).toLocaleDateString()} · {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {n.link && (
                          <ExternalLink className="h-3 w-3 text-[#CE1126] opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 bg-white/[0.02] border-t border-white/10 text-center">
          <p className="text-[9px] text-white/20 uppercase font-bold tracking-tighter">Showing latest {notifications.length} alerts</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
