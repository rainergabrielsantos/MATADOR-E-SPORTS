import { useTeam } from "../hooks/useTeam";
import { useAuth } from "../hooks/useAuth";
import { TeamChat } from "../components/TeamChat";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { 
  Users, 
  Calendar, 
  Bell, 
  Trophy, 
  Settings, 
  ChevronRight, 
  ExternalLink,
  Plus
} from "lucide-react";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export function TeamDashboard() {
  const { user } = useAuth();
  const { roster, announcements, matches, addAnnouncement, loading } = useTeam();
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newTitle && newContent) {
      await addAnnouncement(newTitle, newContent, user.username);
      setNewTitle("");
      setNewContent("");
      setAnnouncementDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CE1126]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Matadors <span className="text-[#CE1126]">Varsity</span>
          </h1>
          <p className="text-[#a8b2bf] text-sm font-medium">Official Valorant Roster · Season 2026</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2">
            <Settings className="h-4 w-4" /> Team Settings
          </Button>
          <Button className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white gap-2">
            <Trophy className="h-4 w-4" /> Match Portal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Roster & Matches */}
        <div className="lg:col-span-4 space-y-8">
          {/* Roster Card */}
          <Card className="bg-[#131318] border-white/10 overflow-hidden">
            <CardHeader className="p-5 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase italic flex items-center gap-2">
                <Users className="h-4 w-4 text-[#CE1126]" /> Active Roster
              </CardTitle>
              <Badge variant="outline" className="text-[10px] border-white/10 text-white/40">5/5 Members</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {roster.map((member) => (
                  <div key={member.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CE1126]/20 to-black border border-white/10 flex items-center justify-center font-bold text-[#CE1126]">
                          {member.name[0]}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#131318] ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-white/10'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#CE1126] transition-colors">{member.name}</p>
                        <p className="text-[10px] text-[#a8b2bf] uppercase font-medium">{member.role}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white/20 hover:text-white">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card className="bg-[#131318] border-white/10">
            <CardHeader className="p-5 border-b border-white/5">
              <CardTitle className="text-sm font-bold uppercase italic flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#CE1126]" /> Upcoming Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-[#CE1126]/10 text-[#CE1126] hover:bg-[#CE1126]/10 text-[9px] border border-[#CE1126]/20">
                      {match.type}
                    </Badge>
                    <span className="text-[10px] text-white/20 font-bold uppercase">{match.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-wider">Opponent</p>
                      <p className="text-sm font-black text-white">{match.opponent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-wider">Time</p>
                      <p className="text-sm font-black text-[#CE1126]">{match.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs text-[#a8b2bf] hover:text-white hover:bg-white/5 gap-2 uppercase font-bold tracking-wider">
                View Full Schedule <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Center Column: Announcements */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase italic flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#CE1126]" /> Announcements
            </h2>
            <Button 
              onClick={() => setAnnouncementDialogOpen(true)}
              size="sm" variant="ghost" className="h-8 text-[10px] uppercase font-bold tracking-wider text-[#CE1126] hover:text-[#CE1126] hover:bg-[#CE1126]/10"
            >
              <Plus className="h-3 w-3 mr-1" /> Post
            </Button>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <Card key={ann.id} className="bg-[#131318] border-white/10 hover:border-[#CE1126]/30 transition-all">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-sm">{ann.title}</h3>
                    <span className="text-[9px] text-white/20 uppercase font-bold">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-[#a8b2bf] leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#CE1126]/10 flex items-center justify-center text-[8px] font-bold text-[#CE1126]">
                      {ann.author[0]}
                    </div>
                    <span className="text-[10px] text-white/40 font-medium">Posted by <span className="text-white">{ann.author}</span></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Integrated Chat */}
        <div className="lg:col-span-4 h-[600px]">
          <TeamChat />
        </div>
      </div>

      {/* Post Announcement Dialog */}
      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent className="bg-[#131318] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="uppercase italic">Post Team <span className="text-[#CE1126]">Announcement</span></DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAnnouncement} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#a8b2bf] uppercase tracking-wider">Title</label>
              <Input 
                placeholder="Scrim update, practice cancelled, etc." 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-white/5 border-white/10 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#a8b2bf] uppercase tracking-wider">Message</label>
              <Textarea 
                placeholder="Enter details here..." 
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="bg-white/5 border-white/10 min-h-[120px]"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button variant="ghost" onClick={() => setAnnouncementDialogOpen(false)} className="text-white">Cancel</Button>
              <Button type="submit" className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white px-8">Post Announcement</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
