import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useAuth } from "../hooks/useAuth";
import { useTickets } from "../hooks/useTickets";
import { Video, Target, Send, Gamepad2, HelpCircle } from "lucide-react";
import { toast } from "sonner";

const SUPPORTED_GAMES = ["Valorant", "League of Legends", "Overwatch 2", "Rocket League"];
const HELP_TYPES = ["VOD Review", "Live Coaching", "Macro Strategy", "Mechanical Drills"];

export function CoachingTicketForm() {
  const { user } = useAuth();
  const { createTicket } = useTickets();
  const [open, setOpen] = useState(false);
  const [vodLink, setVodLink] = useState("");
  const [goals, setGoals] = useState("");
  const [game, setGame] = useState("Valorant");
  const [helpType, setHelpType] = useState("VOD Review");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await createTicket({
      player_id: user.id,
      playerName: user.username,
      vodLink,
      game,
      helpType,
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
        <Button className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white gap-2 shadow-lg shadow-[#CE1126]/20 px-8 h-12 rounded-xl font-black uppercase tracking-widest text-xs">
          <Video className="h-4 w-4" />
          Initiate Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#0a0a0c] border-white/10 text-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#CE1126]/5 rounded-full blur-3xl pointer-events-none" />
        
        <DialogHeader>
          <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-[#CE1126]/20 rounded-2xl">
                <Target className="h-6 w-6 text-[#CE1126]" />
             </div>
             New <span className="text-[#CE1126]">Mission</span>
          </DialogTitle>
          <DialogDescription className="text-white/40 font-medium uppercase tracking-widest text-[10px] mt-2">
            Submit your performance data for elite analysis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Select Game</Label>
              <div className="relative">
                <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#CE1126]" />
                <select 
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 transition-all appearance-none"
                >
                  {SUPPORTED_GAMES.map(g => <option key={g} value={g} className="bg-[#131318]">{g}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Assistance Type</Label>
              <div className="relative">
                <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                <select 
                  value={helpType}
                  onChange={(e) => setHelpType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                >
                  {HELP_TYPES.map(t => <option key={t} value={t} className="bg-[#131318]">{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Media Source (VOD Link)</Label>
            <div className="relative group">
              <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#CE1126] transition-colors" />
              <Input
                placeholder="YouTube or Twitch URL"
                value={vodLink}
                onChange={(e) => setVodLink(e.target.value)}
                className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl text-xs font-bold focus:ring-[#CE1126]/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Directives & Objectives</Label>
            <Textarea
              placeholder="What specifically should the coach look for in this session?"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="bg-white/5 border-white/10 rounded-2xl p-6 min-h-[120px] text-xs font-bold focus:ring-[#CE1126]/50 transition-all placeholder:text-white/10"
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#CE1126]/20">
              <Send className="h-4 w-4 mr-2" />
              Transmit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
