import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTickets } from "../hooks/useTickets";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { ClipboardList, Gamepad2, HelpCircle, Send, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/ui/badge";

export function MemberCoaching() {
  const { user } = useAuth();
  const { tickets, createTicket, loading } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    game: "",
    helpType: "",
    goals: "",
    vodLink: "",
  });

  const memberTickets = tickets.filter(t => t.player_id === user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await createTicket({
        player_id: user.id,
        playerName: user.username,
        game: form.game,
        helpType: form.helpType,
        goals: form.goals,
        vodLink: form.vodLink,
      });
      toast.success("Coaching ticket submitted! A coach will review it soon.");
      setForm({ game: "", helpType: "", goals: "", vodLink: "" });
    } catch (error) {
      toast.error("Failed to submit ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <PageHeader
        title="Member Coaching"
        subtitle="Request specialized help from our Varsity coaches to level up your game."
        backTo="/dashboard"
        backLabel="Dashboard"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Ticket Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#131318] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#CE1126]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#CE1126] rounded-2xl shadow-lg shadow-[#CE1126]/20">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-wider text-white">Submit <span className="text-[#CE1126]">Request</span></h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#a8b2bf] text-xs uppercase font-black tracking-widest ml-1 flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-[#CE1126]" /> Select Game
                  </Label>
                  <Select value={form.game} onValueChange={(v) => setForm(f => ({ ...f, game: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-[#CE1126] text-white">
                      <SelectValue placeholder="Which game?" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131318] border-white/10 text-white">
                      <SelectItem value="Valorant">Valorant</SelectItem>
                      <SelectItem value="League of Legends">League of Legends</SelectItem>
                      <SelectItem value="CS2">Counter-Strike 2</SelectItem>
                      <SelectItem value="Overwatch 2">Overwatch 2</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#a8b2bf] text-xs uppercase font-black tracking-widest ml-1 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-[#CE1126]" /> Area of Focus
                  </Label>
                  <Select value={form.helpType} onValueChange={(v) => setForm(f => ({ ...f, helpType: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-[#CE1126] text-white">
                      <SelectValue placeholder="What do you need?" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131318] border-white/10 text-white">
                      <SelectItem value="VOD Review">VOD Review</SelectItem>
                      <SelectItem value="Mechanics">Mechanics / Aim</SelectItem>
                      <SelectItem value="Game Sense">Game Sense / Strategy</SelectItem>
                      <SelectItem value="Mental">Mental / Performance</SelectItem>
                      <SelectItem value="Drafting">Drafting / Comp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#a8b2bf] text-xs uppercase font-black tracking-widest ml-1">VOD / Match Link (Optional)</Label>
                <Input
                  placeholder="Paste YouTube/Twitch link here"
                  value={form.vodLink}
                  onChange={(e) => setForm(f => ({ ...f, vodLink: e.target.value }))}
                  className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-[#CE1126] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#a8b2bf] text-xs uppercase font-black tracking-widest ml-1">Details & Questions</Label>
                <textarea
                  placeholder="Describe what you want the coach to look at..."
                  value={form.goals}
                  onChange={(e) => setForm(f => ({ ...f, goals: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 min-h-[120px] text-white placeholder-white/20 transition-all"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !form.game || !form.helpType}
                className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 text-white h-14 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-[#CE1126]/20 transition-all group"
              >
                {isSubmitting ? "Deploying Ticket..." : (
                  <>
                    <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* My Active Tickets */}
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase italic tracking-wider text-white">Your <span className="text-[#CE1126]">Queue</span></h3>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
            </div>
          ) : memberTickets.length === 0 ? (
            <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-8 text-center space-y-4">
              <Clock className="h-10 w-10 text-white/10 mx-auto" />
              <p className="text-xs text-[#a8b2bf] font-bold uppercase tracking-widest">No active requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {memberTickets.map(ticket => (
                <div key={ticket.id} className="bg-[#131318] border border-white/10 rounded-2xl p-5 hover:border-[#CE1126]/40 transition-all space-y-3 shadow-xl">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-[#CE1126]/20 text-[#CE1126] border-none text-[10px] uppercase font-black px-2 py-0.5">
                      {ticket.game}
                    </Badge>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      ticket.status === 'Completed' ? 'text-green-500' : 'text-orange-500'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <h4 className="text-white font-bold tracking-tight">{ticket.helpType}</h4>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-widest">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    {ticket.status === 'Completed' && (
                      <Badge className="bg-green-500/10 text-green-500 border-none animate-pulse">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Feedback Ready
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
