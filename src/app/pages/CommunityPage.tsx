import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Calendar, Users, Radio, MapPin, Plus, X, Search, Filter } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

type FeedType = "all" | "lfg" | "streams";

export function CommunityPage() {
  const { user } = useAuth();
  const { posts, createLFG, deleteLFG } = useLFG();
  const [activeTab, setActiveTab] = useState<FeedType>("all");
  const [lfgDialogOpen, setLfgDialogOpen] = useState(false);
  
  // Filters
  const [gameFilter, setGameFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState("all");
  const [intentFilter, setIntentFilter] = useState<LFGIntent | "all">("all");

  const [lfgForm, setLfgForm] = useState({
    game: "",
    rank: "",
    intent: "Casual" as LFGIntent,
    description: "",
    playersNeeded: 5,
  });

  const filteredPosts = posts.filter((post) => {
    if (gameFilter !== "all" && !post.game.toLowerCase().includes(gameFilter.toLowerCase())) return false;
    if (rankFilter !== "all" && !post.rank.toLowerCase().includes(rankFilter.toLowerCase())) return false;
    if (intentFilter !== "all" && post.intent !== intentFilter) return false;
    return true;
  });

  const handlePostLfg = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      createLFG(
        {
          game: lfgForm.game,
          rank: lfgForm.rank,
          intent: lfgForm.intent,
          description: lfgForm.description,
          playersNeeded: lfgForm.playersNeeded,
        },
        user.id,
        user.username
      );
      setLfgDialogOpen(false);
      setLfgForm({ game: "", rank: "", intent: "Casual", description: "", playersNeeded: 5 });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Community Hub"
        subtitle="Find your team, watch live matches, and join the conversation."
        backTo="/dashboard"
        backLabel="Home"
        action={
          <Button
            className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white gap-2"
            onClick={() => setLfgDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create LFG Post
          </Button>
        }
      />

      {/* Filters Bar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-[#a8b2bf] mr-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#CE1126] transition-colors" />
            <Input 
              placeholder="Search by Game..." 
              value={gameFilter === "all" ? "" : gameFilter}
              onChange={(e) => setGameFilter(e.target.value || "all")}
              className="bg-white/5 border-white/10 pl-10 h-10"
            />
          </div>
        </div>

        <Select value={intentFilter} onValueChange={(v) => setIntentFilter(v as any)}>
          <SelectTrigger className="w-[140px] bg-white/5 border-white/10 h-10">
            <SelectValue placeholder="Intent" />
          </SelectTrigger>
          <SelectContent className="bg-[#131318] border-white/10 text-white">
            <SelectItem value="all">All Intents</SelectItem>
            <SelectItem value="Casual">Casual</SelectItem>
            <SelectItem value="Competitive">Competitive</SelectItem>
          </SelectContent>
        </Select>

        <Input 
          placeholder="Rank (e.g. Gold)" 
          value={rankFilter === "all" ? "" : rankFilter}
          onChange={(e) => setRankFilter(e.target.value || "all")}
          className="w-[140px] bg-white/5 border-white/10 h-10"
        />
      </div>

      {/* LFG Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="group bg-[#131318] border border-white/10 rounded-2xl overflow-hidden hover:border-[#CE1126]/50 transition-all flex flex-col"
          >
            <div className="p-5 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <Badge className={post.intent === 'Competitive' ? 'bg-[#CE1126]/20 text-[#CE1126]' : 'bg-blue-500/20 text-blue-400'}>
                  {post.intent}
                </Badge>
                <span className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#CE1126] transition-colors">{post.game}</h3>
                <p className="text-[#a8b2bf] text-sm font-medium">Rank: {post.rank}</p>
              </div>

              <p className="text-sm text-white/70 italic leading-relaxed line-clamp-3">
                "{post.description}"
              </p>

              <div className="flex items-center gap-2 pt-2">
                <div className="w-8 h-8 rounded-full bg-[#CE1126]/20 flex items-center justify-center border border-[#CE1126]/20">
                  <Users className="h-4 w-4 text-[#CE1126]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white font-medium">{post.authorName}</span>
                  <span className="text-[10px] text-[#a8b2bf]">{post.playersCurrent}/{post.playersNeeded} Players</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex gap-2">
              <Button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs h-9">
                View Details
              </Button>
              <Button className="flex-1 bg-[#CE1126] hover:bg-[#CE1126]/90 text-white text-xs h-9">
                Request to Join
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
          <Radio className="h-12 w-12 text-white/10 mx-auto mb-4" />
          <p className="text-[#a8b2bf] font-medium">No LFG posts match your filters.</p>
          <Button variant="link" className="text-[#CE1126]" onClick={() => { setGameFilter("all"); setRankFilter("all"); setIntentFilter("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Create LFG Dialog */}
      <Dialog open={lfgDialogOpen} onOpenChange={setLfgDialogOpen}>
        <DialogContent className="bg-[#131318] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase italic">Create <span className="text-[#CE1126]">LFG Post</span></DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePostLfg} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#a8b2bf] uppercase">Game</label>
                <Input
                  placeholder="e.g. Valorant"
                  value={lfgForm.game}
                  onChange={(e) => setLfgForm(f => ({ ...f, game: e.target.value }))}
                  className="bg-white/5 border-white/10 h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#a8b2bf] uppercase">Rank</label>
                <Input
                  placeholder="e.g. Diamond 2"
                  value={lfgForm.rank}
                  onChange={(e) => setLfgForm(f => ({ ...f, rank: e.target.value }))}
                  className="bg-white/5 border-white/10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#a8b2bf] uppercase">Intent</label>
              <Select value={lfgForm.intent} onValueChange={(v) => setLfgForm(f => ({ ...f, intent: v as LFGIntent }))}>
                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-white/10 text-white">
                  <SelectItem value="Casual">Casual (Fun/Practice)</SelectItem>
                  <SelectItem value="Competitive">Competitive (Ranked/Tourney)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#a8b2bf] uppercase">Description</label>
              <Input
                placeholder="What are you looking for?"
                value={lfgForm.description}
                onChange={(e) => setLfgForm(f => ({ ...f, description: e.target.value }))}
                className="bg-white/5 border-white/10 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#a8b2bf] uppercase">Total Players Needed</label>
              <Select value={String(lfgForm.playersNeeded)} onValueChange={(v) => setLfgForm(f => ({ ...f, playersNeeded: parseInt(v) }))}>
                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-white/10 text-white">
                  {[2, 3, 4, 5, 6].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} Players</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setLfgDialogOpen(false)} className="text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white px-8">
                Post LFG
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
