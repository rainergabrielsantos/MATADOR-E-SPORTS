import { useState, useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import { Users, Radio, Plus, X, Filter, Swords, Shield, AlertCircle, CheckCircle2, Zap, MessageCircle, Heart, Trophy } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { useLFG, LFGPost, LFGIntent } from "../hooks/useLFG";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "../components/ui/select";
import { toast } from "sonner";
import { NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { db } from "../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

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
  const { posts, createLFG, updateLFG, deleteLFG, loading } = useLFG();
  const [lfgDialogOpen, setLfgDialogOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
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
      toast.success("Recruitment Post Published!");
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
    toast.success("Recruitment closed.");
  };

  const seedRecruits = async () => {
    setIsSeeding(true);
    const fabricatedPosts = [
      {
        authorName: "MatadorAce",
        game: "Valorant",
        role: "Duelist",
        intent: "Competitive",
        description: "Looking for an Initiator main and Controller for Diamond 3 grind. Must have comms!",
        playersNeeded: 5,
        playersCurrent: 3,
        status: "Looking",
        createdAt: Timestamp.now(),
      },
      {
        authorName: "JunglerDiff",
        game: "League of Legends",
        role: "Jungler",
        intent: "Casual",
        description: "Need 2 more for some late night ARAMs. Chill vibes only, no toxicity.",
        playersNeeded: 5,
        playersCurrent: 3,
        status: "In-Game & Looking",
        createdAt: Timestamp.now(),
      },
      {
        authorName: "SmashKing818",
        game: "Super Smash Bros.",
        role: "Main",
        intent: "Competitive",
        description: "Local practice session at the USU game room. Looking for high level sets.",
        playersNeeded: 2,
        playersCurrent: 1,
        status: "Looking",
        createdAt: Timestamp.now(),
      },
      {
        authorName: "RocketQueen",
        game: "Rocket League",
        role: "Striker",
        intent: "Competitive",
        description: "Diamond 1 in 2v2 looking for a permanent partner to push into Champ.",
        playersNeeded: 2,
        playersCurrent: 1,
        status: "Looking",
        createdAt: Timestamp.now(),
      },
      {
        authorName: "SupportMainCSUN",
        game: "Overwatch 2",
        role: "Support",
        intent: "Competitive",
        description: "5-stack looking for a Tank player. We are currently Plat 2 average.",
        playersNeeded: 5,
        playersCurrent: 4,
        status: "In-Game & Looking",
        createdAt: Timestamp.now(),
      }
    ];

    try {
      for (const p of fabricatedPosts) {
        // We use a fake authorId for these
        await addDoc(collection(db, "lfg_posts"), {
          ...p,
          authorId: "FABRICATED_USER_" + Math.random().toString(36).substring(7),
        });
      }
      toast.success("Community recruitment feed populated!");
    } catch (err) {
      toast.error("Failed to seed recruits.");
    } finally {
      setIsSeeding(false);
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
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <PageHeader
        title="Active Recruitment"
        subtitle="Join active squads, find partners, and win together.. or lose trying"
        backTo="/dashboard"
        backLabel="Home"
        action={
          <div className="flex gap-3">
             {posts.length < 3 && (
              <Button 
                variant="outline" 
                className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 h-11 px-6 rounded-xl"
                onClick={seedRecruits}
                disabled={isSeeding}
              >
                <Zap className="h-4 w-4 mr-2" /> {isSeeding ? "Populating..." : "Seed Active Recruits"}
              </Button>
            )}
            <Button
              className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white gap-2 shadow-lg shadow-[#CE1126]/20 h-11 px-6 rounded-xl"
              onClick={() => setLfgDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Post Recruitment
            </Button>
          </div>
        }
      />

      {/* Main Recruitment Feed */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#131318] border border-white/10 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl shadow-lg shadow-blue-500/10">
              <Radio className="h-6 w-6 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-wider">Live <span className="text-blue-400">Feed</span></h2>
              <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-[0.2em]">Showing {filteredPosts.length} Active Parties</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 relative z-10">
            <Select value={gameFilter} onValueChange={setGameFilter}>
              <SelectTrigger className="w-[200px] bg-white/5 border-white/10 h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-white">
                <SelectValue placeholder="Game Filter" />
              </SelectTrigger>
              <SelectContent className="bg-[#131318] border-white/10 text-white">
                <SelectItem value="all">All Games</SelectItem>
                {Object.keys(GAME_CAPACITIES).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={intentFilter} onValueChange={(v) => setIntentFilter(v as any)}>
              <SelectTrigger className="w-[160px] bg-white/5 border-white/10 h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-white">
                <SelectValue placeholder="Intent" />
              </SelectTrigger>
              <SelectContent className="bg-[#131318] border-white/10 text-white">
                <SelectItem value="all">All Styles</SelectItem>
                <SelectItem value="Casual">Casual / Chill</SelectItem>
                <SelectItem value="Competitive">Ranked / Sweat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10 space-y-6">
            <Users className="h-16 w-16 text-white/5 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white uppercase italic">Feed is <span className="text-[#CE1126]">Quiet</span></h2>
              <p className="text-[#a8b2bf] max-w-sm mx-auto text-sm leading-relaxed">No active recruitments found for your current filters. Be the first to start a party!</p>
            </div>
            <Button onClick={() => setLfgDialogOpen(true)} className="bg-[#CE1126] text-white rounded-xl px-10 h-12 font-bold uppercase tracking-widest mt-4">
              Start a Squad
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const isOwner = user?.id === post.authorId;
              const maxPlayers = GAME_CAPACITIES[post.game] || 5;
              const isFull = post.playersCurrent >= maxPlayers;
              
              return (
                <div
                  key={post.id}
                  className={`group bg-[#131318] border ${isOwner ? 'border-[#CE1126]/40 shadow-2xl shadow-[#CE1126]/5' : 'border-white/10'} rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all flex flex-col relative`}
                >
                  {isOwner && (
                    <div className="absolute top-0 right-0 p-4">
                      <Button variant="ghost" size="icon" onClick={() => handleEndParty(post.id)} className="h-10 w-10 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-full">
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="p-8 flex-1 space-y-6">
                    <div className="flex justify-between items-start pr-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={post.intent === 'Competitive' ? 'bg-[#CE1126]/20 text-[#CE1126] border-none' : 'bg-blue-500/20 text-blue-400 border-none'}>
                            {post.intent === 'Competitive' ? <Trophy className="h-3 w-3 mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
                            {post.intent}
                          </Badge>
                          {isFull && <Badge className="bg-orange-500/20 text-orange-400 border-none">Full</Badge>}
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic group-hover:text-blue-400 transition-colors tracking-tight">{post.game}</h3>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${post.status === 'Looking' ? 'text-green-500' : 'text-orange-500'}`}>
                          {post.status}
                        </div>
                        <div className="text-3xl font-black text-white/10 leading-none tabular-nums tracking-tighter">
                          <span className={`${isFull ? 'text-orange-500' : 'text-white/40'}`}>{post.playersCurrent}</span>
                          <span className="text-white/10">/</span>
                          {maxPlayers}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-3xl p-5 border border-white/5 space-y-4 relative">
                       <div className="absolute top-4 right-4"><MessageCircle className="h-4 w-4 text-white/5" /></div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Swords className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-[10px] font-black text-[#a8b2bf] uppercase tracking-widest">Main Position: <span className="text-white">{post.role}</span></span>
                      </div>
                      <p className="text-sm text-white/70 italic font-medium leading-relaxed">
                        "{post.description}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-[1.5rem] border border-white/5">
                      <Avatar className="h-12 w-12 border-2 border-white/10 group-hover:border-blue-500/40 transition-colors">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName}`} />
                        <AvatarFallback className="bg-blue-500 text-white font-bold">{post.authorName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-base text-white font-black tracking-tight">{post.authorName}</span>
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-3 w-3 text-blue-400" />
                          <span className="text-[10px] text-[#a8b2bf] uppercase font-black tracking-widest">Verified Matador</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.03] border-t border-white/5 flex gap-4">
                    {isOwner ? (
                      <>
                        <div className="flex-1 flex gap-2">
                          <Button 
                            onClick={() => handleUpdateParty(post.id, Math.max(1, post.playersCurrent - 1), maxPlayers)}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs h-12 rounded-2xl font-black"
                          >
                            -
                          </Button>
                          <Button 
                            onClick={() => handleUpdateParty(post.id, Math.min(maxPlayers, post.playersCurrent + 1), maxPlayers)}
                            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs h-12 rounded-2xl border border-blue-500/20 font-black"
                          >
                            +
                          </Button>
                        </div>
                        <Button 
                          variant="destructive"
                          onClick={() => handleEndParty(post.id)}
                          className="flex-1 text-[10px] h-12 rounded-2xl font-black uppercase tracking-widest"
                        >
                          End Session
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="flex-1 border-white/10 text-white h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5">
                          Profile
                        </Button>
                        <Button className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">
                          Request to Join
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Create LFG Dialog */}
      <Dialog open={lfgDialogOpen} onOpenChange={setLfgDialogOpen}>
        <DialogContent className="bg-[#131318] border-white/10 text-white max-w-lg shadow-2xl rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-wider flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-[1.25rem] shadow-lg shadow-blue-600/20"><Plus className="h-7 w-7 text-white" /></div>
              Post <span className="text-blue-500">Recruitment</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePostLfg} className="space-y-8 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#a8b2bf] uppercase tracking-[0.2em] ml-1">The Game</label>
                <Select value={lfgForm.game} onValueChange={(v) => setLfgForm(f => ({ ...f, game: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500 text-sm font-bold uppercase tracking-tight">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131318] border-white/10 text-white">
                    {Object.keys(GAME_CAPACITIES).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#a8b2bf] uppercase tracking-[0.2em] ml-1">Your Role</label>
                <Select value={lfgForm.role} onValueChange={(v) => setLfgForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500 text-sm font-bold uppercase tracking-tight">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131318] border-white/10 text-white">
                    <SelectGroup>
                      <SelectLabel className="text-blue-400 font-black text-[10px] uppercase tracking-widest py-2">General</SelectLabel>
                      <SelectItem value="Duelist">Duelist</SelectItem>
                      <SelectItem value="IGL">IGL / Leader</SelectItem>
                      <SelectItem value="Support">Support / Healer</SelectItem>
                      <SelectItem value="Flex">Flex / Fill</SelectItem>
                      <SelectItem value="Tank">Tank / Frontline</SelectItem>
                      <SelectItem value="DPS">DPS / Carry</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#a8b2bf] uppercase tracking-[0.2em] ml-1">Squad Intent</label>
              <Select value={lfgForm.intent} onValueChange={(v) => setLfgForm(f => ({ ...f, intent: v as LFGIntent }))}>
                <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500 text-sm font-bold uppercase tracking-tight">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-white/10 text-white">
                  <SelectItem value="Casual">Casual / Chill Games</SelectItem>
                  <SelectItem value="Competitive">Competitive / Elo Grind</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#a8b2bf] uppercase tracking-[0.2em] ml-1">The Pitch</label>
              <Input
                placeholder="Ex: Looking for chill people for late night ARAMs!"
                value={lfgForm.description}
                onChange={(e) => setLfgForm(f => ({ ...f, description: e.target.value }))}
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500 text-sm font-medium"
                required
              />
            </div>

            <div className="bg-blue-600/10 border border-blue-600/20 p-6 rounded-[2rem] flex items-start gap-4">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20"><AlertCircle className="h-5 w-5 text-white shrink-0" /></div>
              <div className="space-y-1">
                <p className="text-sm font-black text-white uppercase tracking-tight">Real-Time Sync</p>
                <p className="text-xs text-[#a8b2bf] leading-relaxed">
                  Your squad size is managed in real-time. Members can see exactly how many spots are left in your party.
                </p>
              </div>
            </div>

            <DialogFooter className="pt-6 gap-4">
              <Button type="button" variant="ghost" onClick={() => setLfgDialogOpen(false)} className="text-white hover:bg-white/5 h-14 rounded-2xl px-8 font-bold uppercase tracking-widest">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl px-12 font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 flex-1">
                Publish Recruitment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
