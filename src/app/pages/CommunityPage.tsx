import { useState, useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import { Calendar, Users, Radio, MapPin, Plus, X, Search, Filter, Gamepad2, Swords, Shield, AlertCircle, Edit2, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { useLFG, LFGPost, LFGIntent, LFGStatus } from "../hooks/useLFG";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "../components/ui/select";
import { useEvents } from "../hooks/useEvents";
import { toast } from "sonner";
import { NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const GAME_CAPACITIES: Record<string, number> = {
  "Valorant": 5,
  "League of Legends": 5,
  "Counter-Strike 2": 5,
  "Overwatch 2": 5,
  "Apex Legends": 3,
  "Rocket League": 3,
  "Super Smash Bros.": 2,
};

export function CommunityPage() {
  const { user } = useAuth();
  const { posts, createLFG, updateLFG, deleteLFG, loading: lfgLoading } = useLFG();
  const { events, rsvps, toggleRSVP, loading: eventsLoading } = useEvents(user?.id);
  const [lfgDialogOpen, setLfgDialogOpen] = useState(false);
  
  // Filters
  const [gameFilter, setGameFilter] = useState("all");
  const [intentFilter, setIntentFilter] = useState<LFGIntent | "all">("all");

  const [lfgForm, setLfgForm] = useState({
    game: user?.games || "Valorant",
    role: user?.mainRole || "Flex",
    intent: "Casual" as LFGIntent,
    description: "",
  });

  const filteredPosts = useMemo(() => posts.filter((post) => {
    if (gameFilter !== "all" && post.game !== gameFilter) return false;
    if (intentFilter !== "all" && post.intent !== intentFilter) return false;
    return post.status !== "End Party";
  }), [posts, gameFilter, intentFilter]);

  const featuredEvents = events.slice(0, 3);

  const handlePostLfg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const maxPlayers = GAME_CAPACITIES[lfgForm.game] || 5;
      await createLFG(
        {
          game: lfgForm.game,
          role: lfgForm.role,
          intent: lfgForm.intent,
          description: lfgForm.description,
          playersNeeded: maxPlayers,
          playersCurrent: 1,
          status: "Looking",
        },
        user.id,
        user.username
      );
      setLfgDialogOpen(false);
      toast.success("LFG Post Published!");
    }
  };

  const handleUpdateParty = async (postId: string, current: number, max: number) => {
    if (current >= max) {
      await updateLFG(postId, { playersCurrent: current, status: "In-Game & Looking" });
    } else {
      await updateLFG(postId, { playersCurrent: current, status: "Looking" });
    }
  };

  const handleEndParty = async (postId: string) => {
    await updateLFG(postId, { status: "End Party" });
    toast.success("Party closed.");
  };

  if (lfgLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CE1126]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <PageHeader
        title="Community Hub"
        subtitle="Connect with Matadors, join squads, and RSVP for campus events."
        backTo="/dashboard"
        backLabel="Home"
        action={
          <div className="flex gap-3">
            <NavLink to="/dashboard/events">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 gap-2 h-11 px-6">
                <Calendar className="h-4 w-4" />
                My Events
                {rsvps.length > 0 && <Badge className="ml-1 bg-[#CE1126]">{rsvps.length}</Badge>}
              </Button>
            </NavLink>
            <Button
              className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white gap-2 shadow-lg shadow-[#CE1126]/20 h-11 px-6"
              onClick={() => setLfgDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Start a Squad
            </Button>
          </div>
        }
      />

      {/* Featured Events Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#CE1126]/10 rounded-lg">
              <Calendar className="h-5 w-5 text-[#CE1126]" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase italic tracking-wider">Upcoming <span className="text-[#CE1126]">CSUN Events</span></h2>
          </div>
          <NavLink to="/dashboard/events" className="text-sm text-[#CE1126] hover:underline font-bold uppercase tracking-widest">View All Events</NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <div key={event.id} className="group relative bg-[#131318] border border-white/10 rounded-2xl overflow-hidden hover:border-[#CE1126]/50 transition-all shadow-xl">
              <div className="aspect-video w-full bg-white/5 relative overflow-hidden">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5 uppercase font-black text-4xl italic select-none">
                    {event.game || "MATADOR"}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131318] to-transparent opacity-60" />
                <Badge className="absolute top-3 right-3 bg-[#CE1126] text-white border-none uppercase text-[10px]">
                  {event.game}
                </Badge>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-white leading-tight">{event.title}</h3>
                <div className="flex flex-col gap-1.5 text-[10px] text-[#a8b2bf] uppercase font-bold tracking-widest">
                  <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-[#CE1126]" /> {event.date}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-[#CE1126]" /> {event.location}</div>
                </div>
                <Button 
                  onClick={() => toggleRSVP(event.id)}
                  className={`w-full text-xs font-bold uppercase h-11 rounded-xl transition-all mt-2 ${
                    rsvps.includes(event.id) 
                      ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20" 
                      : "bg-[#CE1126] text-white hover:bg-[#CE1126]/90"
                  }`}
                >
                  {rsvps.includes(event.id) ? (
                    <><CheckCircle2 className="h-4 w-4 mr-2" /> RSVP'd</>
                  ) : "RSVP Now"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LFG Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Radio className="h-5 w-5 text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase italic tracking-wider">Active <span className="text-blue-500">Recruitment</span></h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-[#a8b2bf] mr-2">
              <Filter className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Filters:</span>
            </div>
            <Select value={gameFilter} onValueChange={setGameFilter}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10 h-10 text-xs">
                <SelectValue placeholder="Game" />
              </SelectTrigger>
              <SelectContent className="bg-[#131318] border-white/10 text-white">
                <SelectItem value="all">All Games</SelectItem>
                {Object.keys(GAME_CAPACITIES).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={intentFilter} onValueChange={(v) => setIntentFilter(v as any)}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 h-10 text-xs">
                <SelectValue placeholder="Intent" />
              </SelectTrigger>
              <SelectContent className="bg-[#131318] border-white/10 text-white">
                <SelectItem value="all">All Intents</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Competitive">Competitive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const isOwner = user?.id === post.authorId;
            const maxPlayers = GAME_CAPACITIES[post.game] || 5;
            
            return (
              <div
                key={post.id}
                className={`group bg-[#131318] border ${isOwner ? 'border-[#CE1126]/40 shadow-2xl shadow-[#CE1126]/5' : 'border-white/10'} rounded-3xl overflow-hidden hover:border-[#CE1126]/50 transition-all flex flex-col relative`}
              >
                {isOwner && (
                  <div className="absolute top-0 right-0 p-3">
                    <Button variant="ghost" size="icon" onClick={() => handleEndParty(post.id)} className="h-9 w-9 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-full">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
                
                <div className="p-6 flex-1 space-y-6">
                  <div className="flex justify-between items-start pr-6">
                    <div className="space-y-1.5">
                      <Badge className={post.intent === 'Competitive' ? 'bg-[#CE1126]/20 text-[#CE1126] border-[#CE1126]/20' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'}>
                        {post.intent}
                      </Badge>
                      <h3 className="text-2xl font-black text-white uppercase italic group-hover:text-[#CE1126] transition-colors tracking-tight">{post.game}</h3>
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${post.status === 'Looking' ? 'text-green-500' : 'text-orange-500'}`}>
                        {post.status}
                      </div>
                      <div className="text-3xl font-black text-white/10 leading-none tabular-nums tracking-tighter">
                        <span className="text-white/40">{post.playersCurrent}</span>/{maxPlayers}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#CE1126]/20 rounded-md">
                        <Swords className="h-3 w-3 text-[#CE1126]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#a8b2bf] uppercase tracking-widest">Main Position: <span className="text-white">{post.role}</span></span>
                    </div>
                    <p className="text-sm text-white/70 italic font-medium leading-relaxed">
                      "{post.description}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                    <Avatar className="h-10 w-10 border-2 border-[#CE1126]/30">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName}`} />
                      <AvatarFallback className="bg-[#CE1126] text-white font-bold">{post.authorName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm text-white font-black tracking-tight">{post.authorName}</span>
                      <span className="text-[10px] text-[#CE1126] uppercase font-bold tracking-[0.2em]">MATADOR ELITE</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white/[0.03] border-t border-white/5 flex gap-3">
                  {isOwner ? (
                    <>
                      <div className="flex-1 flex gap-2">
                        <Button 
                          onClick={() => handleUpdateParty(post.id, Math.max(1, post.playersCurrent - 1), maxPlayers)}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs h-11 rounded-xl"
                        >
                          -
                        </Button>
                        <Button 
                          onClick={() => handleUpdateParty(post.id, Math.min(maxPlayers, post.playersCurrent + 1), maxPlayers)}
                          className="flex-1 bg-[#CE1126]/20 hover:bg-[#CE1126]/30 text-[#CE1126] text-xs h-11 rounded-xl border border-[#CE1126]/20 font-bold"
                        >
                          +
                        </Button>
                      </div>
                      <Button 
                        variant="destructive"
                        onClick={() => handleEndParty(post.id)}
                        className="flex-1 text-xs h-11 rounded-xl font-bold uppercase tracking-wider"
                      >
                        End Party
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs h-11 rounded-xl border border-white/5">
                        Profile
                      </Button>
                      <Button className="flex-[2] bg-[#CE1126] hover:bg-[#CE1126]/90 text-white text-xs h-11 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-[#CE1126]/20">
                        Send Friend Request
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Create LFG Dialog */}
      <Dialog open={lfgDialogOpen} onOpenChange={setLfgDialogOpen}>
        <DialogContent className="bg-[#131318] border-white/10 text-white max-w-lg shadow-2xl rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-wider flex items-center gap-4">
              <div className="p-3 bg-[#CE1126] rounded-2xl shadow-lg shadow-[#CE1126]/20"><Plus className="h-7 w-7 text-white" /></div>
              Recruit <span className="text-[#CE1126]">Squad</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePostLfg} className="space-y-8 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#a8b2bf] uppercase tracking-[0.2em] ml-1">The Game</label>
                <Select value={lfgForm.game} onValueChange={(v) => setLfgForm(f => ({ ...f, game: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-[#CE1126] text-sm">
                    <SelectValue placeholder="Choose game" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131318] border-white/10 text-white">
                    {Object.keys(GAME_CAPACITIES).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#a8b2bf] uppercase tracking-[0.2em] ml-1">Your Role</label>
                <Select value={lfgForm.role} onValueChange={(v) => setLfgForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-[#CE1126] text-sm">
                    <SelectValue placeholder="Choose role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131318] border-white/10 text-white">
                    <SelectGroup>
                      <SelectLabel className="text-[#CE1126] font-black text-[10px] uppercase tracking-widest py-2">General</SelectLabel>
                      <SelectItem value="Duelist">Duelist</SelectItem>
                      <SelectItem value="IGL">IGL</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Flex">Flex / Fill</SelectItem>
                      <SelectItem value="Tank">Tank</SelectItem>
                      <SelectItem value="DPS">DPS</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-[#a8b2bf] uppercase tracking-[0.2em] ml-1">Squad Intent</label>
              <Select value={lfgForm.intent} onValueChange={(v) => setLfgForm(f => ({ ...f, intent: v as LFGIntent }))}>
                <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-[#CE1126] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-white/10 text-white">
                  <SelectItem value="Casual">Casual / Training</SelectItem>
                  <SelectItem value="Competitive">Competitive / Ranked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-[#a8b2bf] uppercase tracking-[0.2em] ml-1">Recruitment Pitch</label>
              <Input
                placeholder="Ex: Looking for an Initiator main for High-Elo ranked!"
                value={lfgForm.description}
                onChange={(e) => setLfgForm(f => ({ ...f, description: e.target.value }))}
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-[#CE1126] text-sm"
                required
              />
            </div>

            <div className="bg-[#CE1126]/10 border border-[#CE1126]/20 p-5 rounded-[1.5rem] flex items-start gap-4">
              <div className="p-2 bg-[#CE1126] rounded-lg shadow-lg shadow-[#CE1126]/20"><AlertCircle className="h-5 w-5 text-white shrink-0" /></div>
              <div className="space-y-1">
                <p className="text-sm font-black text-white uppercase tracking-tight">Auto-Capacity Enabled</p>
                <p className="text-xs text-[#a8b2bf] leading-relaxed">
                  Your squad size is automatically capped based on <span className="text-[#CE1126] font-bold">{lfgForm.game}</span> official rules. You can manage your live party count directly from the post.
                </p>
              </div>
            </div>

            <DialogFooter className="pt-6 gap-4">
              <Button type="button" variant="ghost" onClick={() => setLfgDialogOpen(false)} className="text-white hover:bg-white/5 h-14 rounded-2xl px-8 font-bold uppercase tracking-widest">
                Discard
              </Button>
              <Button type="submit" className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white h-14 rounded-2xl px-12 font-black uppercase tracking-widest shadow-xl shadow-[#CE1126]/30 flex-1">
                Deploy Squad Post
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
