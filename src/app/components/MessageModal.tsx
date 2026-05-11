import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessages";
import { Send, User } from "lucide-react";

interface MessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
}

export function MessageModal({ open, onOpenChange, recipientId, recipientName }: MessageModalProps) {
  const { user } = useAuth();
  const { sendMessage, getConversation } = useMessages();
  const [content, setContent] = useState("");

  const conversation = getConversation(user?.id || "", recipientId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && content.trim()) {
      sendMessage(user.id, user.username, recipientId, content);
      setContent("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#131318] border-white/10 text-white p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle className="flex items-center gap-2 text-sm uppercase italic tracking-wider">
            <User className="h-4 w-4 text-[#CE1126]" />
            Chat with <span className="text-[#CE1126]">{recipientName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[300px] p-4">
          <div className="space-y-4">
            {conversation.length === 0 && (
              <p className="text-center text-white/20 text-xs py-8">No messages yet. Start the conversation!</p>
            )}
            {conversation.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  msg.senderId === user?.id ? 'bg-[#CE1126] text-white rounded-tr-none' : 'bg-white/10 text-[#a8b2bf] rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-white/20 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2">
          <Input 
            placeholder="Type a message..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-white/5 border-white/10 focus:ring-[#CE1126]/50 text-sm"
          />
          <Button type="submit" size="icon" className="bg-[#CE1126] hover:bg-[#CE1126]/90 shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
