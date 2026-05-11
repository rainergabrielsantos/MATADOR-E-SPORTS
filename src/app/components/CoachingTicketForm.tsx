import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useAuth } from "../hooks/useAuth";
import { useTickets } from "../hooks/useTickets";
import { Video, Target, Send } from "lucide-react";
import { toast } from "sonner";

export function CoachingTicketForm() {
  const { user } = useAuth();
  const { createTicket } = useTickets();
  const [open, setOpen] = useState(false);
  const [vodLink, setVodLink] = useState("");
  const [goals, setGoals] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await createTicket({
      player_id: user.id,
      playerName: user.username,
      vodLink,
      goals,
    });

    toast.success("Coaching ticket submitted successfully!");
    setOpen(false);
    setVodLink("");
    setGoals("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white gap-2 shadow-lg shadow-[#CE1126]/20">
          <Video className="h-4 w-4" />
          Request Coaching
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#131318] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold uppercase italic">
            New <span className="text-[#CE1126]">Ticket</span>
          </DialogTitle>
          <DialogDescription className="text-[#a8b2bf]">
            Submit a VOD for review and tell your coach what you want to improve.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="vod" className="text-sm font-medium text-[#a8b2bf]">
              VOD Link (YouTube/Twitch)
            </Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a8b2bf] group-focus-within:text-[#CE1126] transition-colors">
                <Video className="h-4 w-4" />
              </div>
              <Input
                id="vod"
                placeholder="https://youtube.com/watch?v=..."
                value={vodLink}
                onChange={(e) => setVodLink(e.target.value)}
                className="bg-white/5 border-white/10 pl-10 focus:ring-[#CE1126]/50"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goals" className="text-sm font-medium text-[#a8b2bf]">
              Coaching Goals
            </Label>
            <div className="relative group">
              <div className="absolute top-3 left-3 pointer-events-none text-[#a8b2bf] group-focus-within:text-[#CE1126] transition-colors">
                <Target className="h-4 w-4" />
              </div>
              <Textarea
                id="goals"
                placeholder="I want to work on my utility usage and positioning..."
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="bg-white/5 border-white/10 pl-10 min-h-[120px] focus:ring-[#CE1126]/50"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 gap-2">
              <Send className="h-4 w-4" />
              Submit Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
