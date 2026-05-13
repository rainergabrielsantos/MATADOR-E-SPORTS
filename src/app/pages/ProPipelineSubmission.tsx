import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTickets } from "../hooks/useTickets";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { 
  Clapperboard, 
  Target, 
  Send, 
  Gamepad2, 
  HelpCircle,
  Zap,
  ChevronRight,
  ShieldAlert,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const SUPPORTED_GAMES = ["Valorant", "League of Legends", "Overwatch 2", "Rocket League"];
const HELP_TYPES = ["VOD Review", "Live Coaching", "Macro Strategy", "Mechanical Drills"];

export function ProPipelineSubmission() {
  const { user } = useAuth();
  const { createTicket } = useTickets();
  const navigate = useNavigate();
  
  const [vodLink, setVodLink] = useState("");
  const [goals, setGoals] = useState("");
  const [game, setGame] = useState("Valorant");
  const [helpType, setHelpType] = useState("VOD Review");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createTicket({
        player_id: user.id,
        playerName: user.username,
        vodLink,
        game,
        helpType,
        goals,
      });

      toast.success("MISSION TRANSMITTED. Your coach has been alerted.");
      navigate("/dashboard/path-to-pro");
    } catch (error) {
      toast.error("Transmission failure. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Mission Briefing"
        subtitle="Submit performance data for technical analysis"
        backTo="/dashboard/path-to-pro"
        backLabel="Pro Pipeline"
      />

      <div className="bg-[#0a0a0c] border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#CE1126]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-[#CE1126]/20 rounded-2xl border border-[#CE1126]/20 shadow-xl shadow-[#CE1126]/5">
              <ShieldAlert className="h-8 w-8 text-[#CE1126]" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Review <span className="text-[#CE1126]">Initialization</span></h2>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-relaxed">Ensure all data fields are populated for optimal feedback accuracy.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CE1126] ml-2">Operation Theater (Game)</Label>
                <div className="relative group">
                  <Gamepad2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#CE1126] transition-all" />
                  <select 
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 transition-all appearance-none cursor-pointer"
                  >
                    {SUPPORTED_GAMES.map(g => <option key={g} value={g} className="bg-[#131318]">{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2">Support Protocol (Type)</Label>
                <div className="relative group">
                  <HelpCircle className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-blue-400 transition-all" />
                  <select 
                    value={helpType}
                    onChange={(e) => setHelpType(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {HELP_TYPES.map(t => <option key={t} value={t} className="bg-[#131318]">{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Raw Data Feed (VOD Link)</Label>
              <div className="relative group">
                <Clapperboard className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[#CE1126] transition-all" />
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={vodLink}
                  onChange={(e) => setVodLink(e.target.value)}
                  className="bg-white/[0.03] border-white/10 pl-14 h-16 rounded-2xl text-sm font-bold focus:ring-[#CE1126]/50 transition-all"
                  required
                />
              </div>
              <p className="text-[9px] text-white/20 font-black uppercase tracking-widest px-2 flex items-center gap-2">
                <AlertCircle className="h-3 w-3" /> Supporting YouTube, Twitch, and Medal clips.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Strategic Objectives</Label>
              <div className="relative group">
                <Target className="absolute left-5 top-6 h-5 w-5 text-white/20 group-focus-within:text-[#CE1126] transition-all" />
                <Textarea
                  placeholder="Identify specific mechanics or decision-making phases for the coach to scrutinize..."
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 pl-14 min-h-[180px] text-sm font-bold focus:ring-[#CE1126]/50 transition-all placeholder:text-white/10 resize-none"
                  required
                />
              </div>
            </div>

            <div className="pt-6">
               <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 h-20 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-[#CE1126]/20 group transition-all"
               >
                  {isSubmitting ? (
                    "Transmitting Data..."
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-3 group-hover:scale-125 transition-transform" />
                      Initialize Analysis Session
                    </>
                  )}
               </Button>
               <p className="text-[9px] text-center text-white/20 mt-6 font-black uppercase tracking-[0.3em]">
                  Analysis queue typically processes within 24-48 hours.
               </p>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Precision", icon: Target, text: "Specific timestamps help coaches pinpoint errors." },
           { label: "Context", icon: Zap, text: "Explain your thought process for better macro feedback." },
           { label: "Growth", icon: TrendingUp, text: "Each review directly evolves your Gamer Skill Tree." }
         ].map(item => (
           <div key={item.label} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                 <item.icon className="h-4 w-4 text-[#CE1126]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.label}</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-wider">{item.text}</p>
           </div>
         ))}
      </div>
    </div>
  );
}
