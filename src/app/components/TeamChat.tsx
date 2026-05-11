import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessages";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Send, User } from "lucide-react";

export function TeamChat() {
  const { user } = useAuth();
  const { sendMessage, getConversation, loading } = useMessages(user?.id);
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // For this demo, we'll use a hardcoded "TEAM_CHANNEL" as the recipientId
  const TEAM_CHANNEL_ID = "TEAM_MATADORS_VARSITY";
  const messages = getConversation(user?.id || "", TEAM_CHANNEL_ID);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && content.trim()) {
      sendMessage(user.id, user.username, TEAM_CHANNEL_ID, content);
      setContent("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#131318] border border-white/10 rounded-2xl overflow-hidden items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CE1126]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#131318] border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase italic flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Team <span className="text-[#CE1126]">Channel</span>
        </h3>
        <span className="text-[10px] text-white/30 uppercase font-medium">8 Members Online</span>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1 mb-1">
                   {!isMe && <span className="text-[10px] font-bold text-[#CE1126] uppercase">{msg.senderName}</span>}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  isMe ? 'bg-[#CE1126] text-white rounded-tr-none' : 'bg-white/10 text-[#a8b2bf] rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[9px] text-white/10 mt-1 uppercase">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2 bg-white/[0.02]">
        <Input 
          placeholder="Message #team-channel..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-white/5 border-white/10 focus:ring-[#CE1126]/50 text-sm h-10"
        />
        <Button type="submit" size="icon" className="bg-[#CE1126] hover:bg-[#CE1126]/90 shrink-0 h-10 w-10">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
