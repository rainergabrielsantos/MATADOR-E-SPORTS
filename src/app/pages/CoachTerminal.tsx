import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { CoachingKanban } from "../components/CoachingKanban";
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
  LayoutDashboard,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
  ChevronRight,
  Save
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
import { Input } from "../components/ui/input";
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

  const memberRequests = tickets.filter(t => t.status === "Pending" || (t.status === "Assigned" && t.coach_id === user?.id));
  
  const players = roster.filter(m => m.role === "Varsity Player");

  const handleReviewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setFeedback(ticket.feedback || "");
  };

  const handleUpdateTicket = async (status: TicketStatus) => {
    if (!selectedTicket) return;
    setIsUpdating(true);
    try {
      await updateTicketStatus(selectedTicket.id, status, undefined, feedback);
      toast.success(`Ticket marked as ${status}`);
      setSelectedTicket(null);
    } catch (error) {
      toast.error("Failed to update ticket.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClaimTicket = async (ticketId: string) => {
    if (!user) return;
    try {
      await assignCoach(ticketId, user.id, user.username);
      toast.success("Ticket claimed! You are now the assigned coach.");
    } catch (error) {
      toast.error("Failed to claim ticket.");
    }
  };

  const handleSaveStats = async () => {
    if (!selectedPlayer) return;
    setIsSavingStats(true);
    try {
      await updatePlayerStats(selectedPlayer.id, metrics);
      toast.success(`Performance metrics updated for ${selectedPlayer.name}`);
      setSelectedPlayer(null);
    } catch (error) {
      toast.error("Failed to update performance metrics.");
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
    <div className="p-8 max-w-7xl mx-auto min-h-full space-y-12 animate-in fade-in duration-700">
      <PageHeader
        title="Coach Terminal"
        subtitle="Staff Command: Manage member requests, track varsity progress, and provide elite analysis."
        backTo="/dashboard"
        backLabel="Dashboard"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Member Requests Queue */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#CE1126]/20 rounded-lg">
                <ClipboardList className="h-5 w-5 text-[#CE1126]" />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-wider text-white">Member <span className="text-[#CE1126]">Queue</span></h2>
            </div>
            <Badge className="bg-[#CE1126] text-white font-black">{memberRequests.length}</Badge>
          </div>

          <div className="space-y-4">
            {memberRequests.length === 0 ? (
              <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] p-10 text-center space-y-4">
                <Clock className="h-10 w-10 text-white/10 mx-auto" />
                <p className="text-[10px] text-[#a8b2bf] font-black uppercase tracking-widest leading-relaxed">No pending coaching requests from the community.</p>
              </div>
            ) : (
              memberRequests.map(ticket => (
                <div 
                  key={ticket.id} 
                  className={`bg-[#131318] border ${ticket.coach_id === user?.id ? 'border-blue-500/40 shadow-blue-500/5' : 'border-white/10'} rounded-[1.5rem] p-6 hover:border-[#CE1126]/40 transition-all space-y-4 shadow-xl group`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Badge className="bg-[#CE1126]/10 text-[#CE1126] border-none text-[10px] uppercase font-black">{ticket.game}</Badge>
                      <h4 className="text-white font-black uppercase tracking-tight text-sm leading-tight group-hover:text-[#CE1126] transition-colors">{ticket.playerName}</h4>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase border-white/10 text-[#a8b2bf]">
                      {ticket.helpType}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-[#a8b2bf] line-clamp-2 italic">"{ticket.goals}"</p>
                  
                  <div className="flex gap-2 pt-2">
                    {ticket.coach_id === user?.id ? (
                      <Button 
                        onClick={() => handleReviewTicket(ticket)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest h-10 rounded-xl"
                      >
                        Provide Feedback
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleClaimTicket(ticket.id)}
                        className="w-full bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest h-10 rounded-xl border border-white/10"
                      >
                        Claim Request
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center Column: Varsity Performance Center */}
        <div className="lg:col-span-5 space-y-8">
           <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg shadow-lg shadow-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-wider text-white">Performance <span className="text-blue-400">Center</span></h2>
          </div>

          <div className="bg-[#131318] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
             
             <div className="space-y-4">
                <p className="text-[10px] text-[#a8b2bf] uppercase font-black tracking-widest ml-1">Select Varsity Player to Edit Metrics</p>
                <div className="grid grid-cols-1 gap-3">
                  {players.map(player => (
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
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{player.name}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${selectedPlayer?.id === player.id ? 'text-blue-400' : 'text-white/20'}`} />
                    </button>
                  ))}
                </div>
             </div>

             {selectedPlayer && (
               <div className="space-y-8 pt-4 animate-in slide-in-from-top-4 duration-500">
                  <div className="h-px bg-white/10" />
                  
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
                          className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={handleSaveStats}
                    disabled={isSavingStats}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
                  >
                    {isSavingStats ? "Saving Metrics..." : <><Save className="h-5 w-5 mr-2" /> Publish to Player Dashboard</>}
                  </Button>
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Active Varsity Kanban */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg shadow-lg shadow-blue-500/10">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-wider text-white">Varsity <span className="text-blue-400">Board</span></h2>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
            <CoachingKanban />
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="bg-[#131318] border-white/10 text-white max-w-lg rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-wider flex items-center gap-3">
              <div className="p-2 bg-[#CE1126] rounded-xl"><MessageSquare className="h-6 w-6 text-white" /></div>
              Coaching <span className="text-[#CE1126]">Review</span>
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6 pt-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <p className="text-[10px] text-[#CE1126] font-black uppercase tracking-widest">Player Perspective</p>
                <p className="text-sm text-white italic">"{selectedTicket.goals}"</p>
                {selectedTicket.vodLink && (
                  <Button variant="link" className="p-0 text-blue-400 text-[10px] font-black uppercase h-auto" asChild>
                    <a href={selectedTicket.vodLink} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" /> Open VOD Link
                    </a>
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-[#a8b2bf] font-black uppercase tracking-[0.2em] ml-1">Coach's Analysis & Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide detailed feedback and improvement steps..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 min-h-[150px] text-white placeholder-white/20 transition-all text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button 
                  onClick={() => handleUpdateTicket("In-Progress")}
                  disabled={isUpdating}
                  className="bg-white/5 hover:bg-white/10 text-white h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-white/10"
                >
                  Mark In-Progress
                </Button>
                <Button 
                  onClick={() => handleUpdateTicket("Completed")}
                  disabled={isUpdating}
                  className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white h-12 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#CE1126]/20"
                >
                  {isUpdating ? "Saving..." : "Submit Review"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
