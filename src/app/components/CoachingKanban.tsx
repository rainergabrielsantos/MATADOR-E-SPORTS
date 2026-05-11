import { useTickets, CoachingTicket, TicketStatus } from "../hooks/useTickets";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Video, User, CheckCircle, ArrowRight, MessageCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { MessageModal } from "./MessageModal";

export function CoachingKanban() {
  const { tickets, updateTicketStatus, loading } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<CoachingTicket | null>(null);
  const [feedbackUrl, setFeedbackUrl] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CE1126]"></div>
      </div>
    );
  }
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  
  const [messageTicket, setMessageTicket] = useState<CoachingTicket | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);

  const columns: { status: TicketStatus; label: string; color: string }[] = [
    { status: "Pending", label: "Pending Review", color: "bg-yellow-500" },
    { status: "In-Progress", label: "In Analysis", color: "bg-blue-500" },
    { status: "Completed", label: "Finished", color: "bg-green-500" },
  ];

  const handleStartReview = (ticket: CoachingTicket) => {
    updateTicketStatus(ticket.id, "In-Progress");
    toast.info(`Reviewing ticket for ${ticket.playerName}`);
  };

  const handleCompleteReview = (ticket: CoachingTicket) => {
    setSelectedTicket(ticket);
    setCompleteDialogOpen(true);
  };

  const handleOpenMessage = (ticket: CoachingTicket) => {
    setMessageTicket(ticket);
    setMessageOpen(true);
  };

  const submitCompletion = () => {
    if (selectedTicket && feedbackUrl) {
      updateTicketStatus(selectedTicket.id, "Completed", feedbackUrl);
      setCompleteDialogOpen(false);
      setFeedbackUrl("");
      setSelectedTicket(null);
      toast.success("Ticket marked as completed!");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((col) => (
        <div key={col.status} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <h3 className="text-white font-bold uppercase tracking-wider text-sm">{col.label}</h3>
            </div>
            <Badge variant="outline" className="text-white/40 border-white/10">
              {tickets.filter((t) => t.status === col.status).length}
            </Badge>
          </div>

          <div className="flex flex-col gap-3 min-h-[500px] bg-white/[0.02] rounded-2xl p-3 border border-white/5">
            {tickets
              .filter((t) => t.status === col.status)
              .map((ticket) => (
                <Card key={ticket.id} className="bg-[#131318] border-white/10 hover:border-white/20 transition-all group">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#CE1126]" />
                        <CardTitle className="text-sm font-semibold text-white">{ticket.playerName}</CardTitle>
                      </div>
                      <span className="text-[10px] text-white/30 uppercase">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-[#a8b2bf] line-clamp-2 italic">"{ticket.goals}"</p>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-4">
                    <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 rounded-lg truncate">
                      <Video className="h-3 w-3 text-[#CE1126]" />
                      {ticket.vodLink}
                    </div>
                    
                    <div className="flex gap-2">
                      {ticket.status === "Pending" && (
                        <Button 
                          onClick={() => handleStartReview(ticket)}
                          size="sm" 
                          className="w-full bg-white/5 hover:bg-white/10 text-white text-xs gap-1 border border-white/10"
                        >
                          Start Review <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                      {ticket.status === "In-Progress" && (
                        <Button 
                          onClick={() => handleCompleteReview(ticket)}
                          size="sm" 
                          className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 text-white text-xs gap-1"
                        >
                          Complete <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleOpenMessage(ticket)}
                        size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-white"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <a href={ticket.vodLink} target="_blank" rel="noreferrer">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-white">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        {/* ... existing dialog ... */}
        <DialogContent className="bg-[#131318] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="uppercase italic">Complete <span className="text-[#CE1126]">Coaching Ticket</span></DialogTitle>
            <DialogDescription className="text-[#a8b2bf]">
              Attach the annotated VOD link and provide any final notes for the player.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Annotated VOD URL</Label>
              <Input 
                id="feedback" 
                placeholder="https://annotated-vod.com/..." 
                value={feedbackUrl}
                onChange={(e) => setFeedbackUrl(e.target.value)}
                className="bg-white/5 border-white/10 focus:ring-[#CE1126]/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={submitCompletion} className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white">
              Deliver Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {messageTicket && (
        <MessageModal 
          open={messageOpen} 
          onOpenChange={setMessageOpen} 
          recipientId={messageTicket.player_id}
          recipientName={messageTicket.playerName}
        />
      )}
    </div>
  );
}
