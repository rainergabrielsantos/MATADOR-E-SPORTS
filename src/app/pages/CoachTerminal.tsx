import { useState, useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import { useTickets, TicketStatus } from "../hooks/useTickets";
import { useAuth } from "../hooks/useAuth";
import { useTeam } from "../hooks/useTeam";
import { usePlayerStats } from "../hooks/usePlayerStats";
import { 
  Users, 
  Target, 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare,
  Shield,
  TrendingUp,
  ChevronRight,
  Save,
  AlertCircle,
  Bell,
  Zap,
  Activity,
  History
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "../components/ui/dialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export function CoachTerminal() {
  const { user } = useAuth();
  const { tickets, updateTicketStatus, assignCoach, loading: ticketsLoading } = useTickets();
  const { roster, loading: rosterLoading } = useTeam();
  const { updatePlayerStats } = usePlayerStats();
  
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Performance Center State
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [metrics, setMetrics] = useState({ aim: 80, sense: 80, mental: 80 });
  const [isSavingStats, setIsSavingStats] = useState(false);

  // Filtered Tickets for the Board
  const clientTickets = useMemo(() => tickets.filter(t => t.status === "Pending" || (t.status === "Assigned" && t.coach_id === user?.id)), [tickets, user]);
  const varsityPending = useMemo(() => tickets.filter(t => t.status === "In-Progress"), [tickets]);

  const handleReviewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setFeedback(ticket.feedback || "");
  };

  const handleUpdateTicket = async (status: TicketStatus) => {
    if (!selectedTicket) return;
    setIsUpdating(true);
    try {
      await updateTicketStatus(selectedTicket.id, status, undefined, feedback);
      toast.success(`Task marked as ${status}`);
      setSelectedTicket(null);
    } catch (error) {
      toast.error("Failed to update task.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClaimTicket = async (ticketId: string) => {
    if (!user) return;
    try {
      await assignCoach(ticketId, user.id, user.username);
      toast.success("Task claimed! Added to your reminder board.");
    } catch (error) {
      toast.error("Failed to claim task.");
    }
  };

  const handleSaveStats = async () => {
    if (!selectedPlayer) return;
    setIsSavingStats(true);
    try {
      await updatePlayerStats(selectedPlayer.id, metrics);
      toast.success(`Metrics updated for ${selectedPlayer.name}`);
      setSelectedPlayer(null);
    } catch (error) {
      toast.error("Failed to update metrics.");
    } finally {
      setIsSavingStats(false);
    }
  };

  if (ticketsLoading || rosterLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CE1126]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-full space-y-12 animate-in fade-in duration-700">
      <PageHeader
        title="Coach Command Terminal"
        backTo="/dashboard"
        backLabel="Dashboard"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: THE REAL-TIME REMINDER BOARD (VARSITY & CLIENTS) */}
        <div className="xl:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#CE1126]/20 rounded-2xl shadow-lg shadow-[#CE1126]/10">
                <Bell className="h-6 w-6 text-[#CE1126] animate-bounce" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-wider text-white">Action <span className="text-[#CE1126]">Board</span></h2>
                <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-[0.2em]">Daily Operational Reminders & Pending Reviews</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Badge className="bg-white/5 border border-white/10 text-white font-black px-4 py-2 rounded-xl">
                {clientTickets.length + varsityPending.length} Active Tasks
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section: Varsity Squad Directives */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Varsity Squad Reviews</h3>
              </div>
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 min-h-[500px] space-y-4">
                {varsityPending.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <History className="h-12 w-12 text-white/5" />
                    <p className="text-[10px] text-[#a8b2bf] font-black uppercase tracking-widest">No active varsity reviews</p>
                  </div>
                ) : (
                  varsityPending.map(ticket => (
                    <div key={ticket.id} className="bg-[#131318] border border-blue-500/30 rounded-2xl p-5 hover:bg-blue-500/[0.02] transition-all space-y-4 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                      <div className="flex justify-between items-start">
                         <Badge className="bg-blue-500/10 text-blue-400 border-none text-[9px] uppercase font-black">{ticket.game}</Badge>
                         <span className="text-[9px] text-white/20 font-black uppercase tracking-widest italic">In Analysis</span>
                      </div>
                      <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-tight group-hover:text-blue-400 transition-colors">{ticket.playerName}</h4>
                        <p className="text-[10px] text-[#a8b2bf] mt-1 italic line-clamp-2">"{ticket.goals}"</p>
                      </div>
                      <Button 
                        onClick={() => handleReviewTicket(ticket)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase h-10 rounded-xl"
                      >
                        Complete Review
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section: Community Client Requests */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2">
                <Activity className="h-4 w-4 text-[#CE1126]" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Client Support Tickets</h3>
              </div>
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 min-h-[500px] space-y-4">
                 {clientTickets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <ClipboardList className="h-12 w-12 text-white/5" />
                    <p className="text-[10px] text-[#a8b2bf] font-black uppercase tracking-widest">Client queue is empty</p>
                  </div>
                ) : (
                  clientTickets.map(ticket => (
                    <div key={ticket.id} className={`bg-[#131318] border ${ticket.coach_id === user?.id ? 'border-[#CE1126]/40' : 'border-white/10'} rounded-2xl p-5 hover:border-[#CE1126]/60 transition-all space-y-4 shadow-xl group`}>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Badge className="bg-[#CE1126]/10 text-[#CE1126] border-none text-[9px] uppercase font-black">{ticket.game}</Badge>
                          <h4 className="text-white font-black text-sm uppercase group-hover:text-[#CE1126] transition-colors">{ticket.playerName}</h4>
                        </div>
                        <Badge variant="outline" className="text-[8px] uppercase border-white/10 text-white/40">{ticket.helpType}</Badge>
                      </div>
                      <p className="text-[10px] text-[#a8b2bf] italic line-clamp-2">"{ticket.goals}"</p>
                      <div className="flex gap-2">
                        {ticket.coach_id === user?.id ? (
                          <Button 
                            onClick={() => handleReviewTicket(ticket)}
                            className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 text-white text-[10px] font-black uppercase h-10 rounded-xl"
                          >
                            Finalize Feedback
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleClaimTicket(ticket.id)}
                            className="w-full bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase h-10 rounded-xl border border-white/10"
                          >
                            Claim Task
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PERFORMANCE & ROSTER MANAGEMENT */}
        <div className="xl:col-span-4 space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl shadow-lg shadow-blue-500/10">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-wider text-white">Live <span className="text-blue-400">Metrics</span></h2>
              <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-[0.2em]">Player Performance Calibration</p>
            </div>
          </div>

          <div className="bg-[#131318] border border-white/10 rounded-[3rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
             
             <div className="space-y-4">
                <p className="text-[10px] text-[#a8b2bf] uppercase font-black tracking-widest ml-1">Roster Pulse</p>
                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {roster.filter(m => m.role === "Varsity Player").map(player => (
                    <button 
                      key={player.id}
                      onClick={() => {
                        setSelectedPlayer(player);
                        setMetrics({ aim: 80, sense: 80, mental: 80 });
                      }}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                        selectedPlayer?.id === player.id 
                          ? 'bg-blue-500/10 border-blue-500/50' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white/10">
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback className="bg-blue-500 text-white font-black">{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <span className="block text-sm font-black text-white uppercase tracking-tight leading-none">{player.name}</span>
                          <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-1 inline-block">Active Roster</span>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${selectedPlayer?.id === player.id ? 'text-blue-400' : 'text-white/10'}`} />
                    </button>
                  ))}
                </div>
             </div>

             {selectedPlayer ? (
               <div className="space-y-8 pt-6 border-t border-white/10 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    {(["aim", "sense", "mental"] as const).map(metric => (
                      <div key={metric} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white">
                            {metric === 'sense' ? 'Game Sense' : metric}
                          </label>
                          <span className="text-sm font-black text-blue-400">{metrics[metric]}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={metrics[metric]}
                          onChange={(e) => setMetrics(m => ({ ...m, [metric]: parseInt(e.target.value) }))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={handleSaveStats}
                    disabled={isSavingStats}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                  >
                    {isSavingStats ? "Saving..." : <><Save className="h-5 w-5 mr-2" /> Sync Metrics</>}
                  </Button>
               </div>
             ) : (
               <div className="text-center py-12 space-y-4 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                 <Target className="h-10 w-10 text-white/5 mx-auto" />
                 <p className="text-[10px] text-[#a8b2bf] font-black uppercase tracking-widest">Select a player to calibrate</p>
               </div>
             )}
          </div>
        </div>

      </div>

      {/* Unified Review Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="bg-[#131318] border-white/10 text-white max-w-lg rounded-[2.5rem] shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-wider flex items-center gap-4">
              <div className="p-3 bg-[#CE1126] rounded-2xl shadow-lg shadow-[#CE1126]/20">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              Mission <span className="text-[#CE1126]">Briefing</span>
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-8 pt-8">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="h-12 w-12" /></div>
                <p className="text-[10px] text-[#CE1126] font-black uppercase tracking-[0.2em]">Context & Requirements</p>
                <p className="text-sm text-white/80 italic leading-relaxed">"{selectedTicket.goals}"</p>
                {selectedTicket.vodLink && (
                  <Button variant="link" className="p-0 text-blue-400 text-[10px] font-black uppercase h-auto" asChild>
                    <a href={selectedTicket.vodLink} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" /> View Associated Media
                    </a>
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-[#a8b2bf] font-black uppercase tracking-[0.2em] ml-1">Critique & Directives</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter specific critiques and development steps..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 min-h-[180px] text-white placeholder-white/20 transition-all text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleUpdateTicket("In-Progress")}
                  disabled={isUpdating}
                  className="bg-white/5 hover:bg-white/10 text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/10"
                >
                  Hold / Draft
                </Button>
                <Button 
                  onClick={() => handleUpdateTicket("Completed")}
                  disabled={isUpdating}
                  className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#CE1126]/30"
                >
                  {isUpdating ? "Delivering..." : "Deliver Review"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
