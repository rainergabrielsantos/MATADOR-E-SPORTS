import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Calendar, Users, Radio, MapPin, Plus, X } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

type FeedType = "all" | "events" | "lfg" | "streams";

interface FeedItem {
  id: string;
  type: "event" | "lfg" | "stream";
  title: string;
  game: string;
  date?: string;
  time?: string;
  location?: string;
  attendees?: number;
  image?: string;
  author?: string;
  rank?: string;
  role?: string;
  players?: string;
  streamer?: string;
  viewers?: number;
  live?: boolean;
}

const allFeedItems: FeedItem[] = [
  {
    id: "f1",
    type: "event",
    title: "Spring LAN Party",
    date: "April 15, 2026",
    time: "6:00 PM – 11:00 PM",
    location: "University Student Union",
    game: "Multi-Game",
    attendees: 87,
    image:
      "https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGRlc2slMjBuZW9ufGVufDF8fHx8MTc3NTcxNzExNXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "f2",
    type: "lfg",
    title: "Looking for Valorant Stack",
    author: "RedMatador",
    rank: "Diamond 2",
    game: "Valorant",
    role: "Looking for Support / Sentinel",
    players: "3/5",
  },
  {
    id: "f3",
    type: "stream",
    title: "CSUN vs UCLA Scrimmage",
    streamer: "CSUNEsportsTV",
    game: "League of Legends",
    viewers: 234,
    live: true,
  },
  {
    id: "f4",
    type: "lfg",
    title: "Need 1 for Ranked League",
    author: "MatadorGG",
    rank: "Gold 1",
    game: "League of Legends",
    role: "Looking for Jungle Main",
    players: "4/5",
  },
  {
    id: "f5",
    type: "event",
    title: "Rocket League Tournament",
    date: "April 20, 2026",
    time: "2:00 PM – 6:00 PM",
    location: "Online",
    game: "Rocket League",
    attendees: 32,
    image:
      "https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwc3R1ZGVudHMlMjB0ZWFtfGVufDF8fHx8MTc3NTcxNzExNnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "f6",
    type: "stream",
    title: "Ranked Grind to Radiant",
    streamer: "MatadorAce",
    game: "Valorant",
    viewers: 89,
    live: true,
  },
  {
    id: "f7",
    type: "lfg",
    title: "CS2 5-Stack Weekend Grind",
    author: "SilverMat",
    rank: "MG2",
    game: "CS2",
    role: "Looking for 2 entry fraggers",
    players: "3/5",
  },
];

// LFG Post creation form initial state
const emptyLfgForm = {
  game: "",
  role: "",
  rank: "",
  playersNeeded: "1",
};

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState<FeedType>("all");
  const [joinedLfg, setJoinedLfg] = useState<Set<string>>(new Set());
  const [lfgDialogOpen, setLfgDialogOpen] = useState(false);
  const [lfgForm, setLfgForm] = useState(emptyLfgForm);

  const tabs: { id: FeedType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "events", label: "Events" },
    { id: "lfg", label: "LFG" },
    { id: "streams", label: "Live" },
  ];

  const filtered = allFeedItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "streams") return item.type === "stream";
    return item.type === activeTab;
  });

  function handleJoinLfg(id: string) {
    setJoinedLfg((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handlePostLfg() {
    // TODO: replace with API call to create LFG post
    console.log("New LFG post:", lfgForm);
    setLfgForm(emptyLfgForm);
    setLfgDialogOpen(false);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Community Hub"
        subtitle="Find your team, watch live matches, and join events."
        backTo="/dashboard"
        backLabel="Home"
        action={
          <Button
            id="post-lfg-btn"
            className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white flex items-center gap-2"
            onClick={() => setLfgDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Post LFG
          </Button>
        }
      />

      {/* Tab Filter */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`community-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/20"
                : "bg-white/5 border border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.id === "streams" && (
              <span className="ml-2 inline-block w-1.5 h-1.5 bg-[#CE1126] rounded-full animate-pulse align-middle" />
            )}
          </button>
        ))}
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#CE1126]/40 hover:bg-white/8 transition-all"
          >
            {/* Event image */}
            {item.type === "event" && item.image && (
              <div className="h-36 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Stream live bar */}
            {item.type === "stream" && item.live && (
              <div className="h-1 bg-gradient-to-r from-[#CE1126] to-[#CE1126]/30" />
            )}

            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-medium group-hover:text-[#CE1126] transition-colors pr-2">
                  {item.title}
                </h3>
                <Badge className="bg-[#CE1126]/20 text-[#CE1126] hover:bg-[#CE1126]/30 text-xs flex-shrink-0">
                  {item.game}
                </Badge>
              </div>

              {/* Event details */}
              {item.type === "event" && (
                <div className="space-y-1.5 text-sm text-[#a8b2bf]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {item.date} · {item.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white mt-2">
                    <Users className="h-4 w-4 text-[#CE1126]" />
                    <span>{item.attendees} attending</span>
                  </div>
                </div>
              )}

              {/* LFG details */}
              {item.type === "lfg" && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#a8b2bf]">
                    <span>by {item.author}</span>
                    <Badge
                      variant="outline"
                      className="text-xs border-[#a8b2bf]/50"
                    >
                      {item.rank}
                    </Badge>
                  </div>
                  <p className="text-white">{item.role}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[#a8b2bf]">
                      {item.players} Players
                    </span>
                    <button
                      id={`join-lfg-${item.id}`}
                      onClick={() => handleJoinLfg(item.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        joinedLfg.has(item.id)
                          ? "bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-red-900/20 hover:text-red-400 hover:border-red-600/30"
                          : "bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
                      }`}
                    >
                      {joinedLfg.has(item.id) ? (
                        <>
                          <X className="h-3 w-3" /> Leave
                        </>
                      ) : (
                        "Join"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Stream details */}
              {item.type === "stream" && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {item.live && (
                      <div className="flex items-center gap-1">
                        <Radio className="h-4 w-4 text-[#CE1126] animate-pulse" />
                        <Badge className="bg-[#CE1126] text-white hover:bg-[#CE1126] text-xs">
                          LIVE
                        </Badge>
                      </div>
                    )}
                  </div>
                  <p className="text-[#a8b2bf]">by {item.streamer}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-white">
                      <Users className="h-4 w-4 text-[#CE1126]" />
                      <span>{item.viewers} viewers</span>
                    </div>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      id={`watch-stream-${item.id}`}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg border border-white/20 transition-all"
                    >
                      Watch →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#a8b2bf]">No posts found in this category.</p>
        </div>
      )}

      {/* Post LFG Dialog */}
      <Dialog open={lfgDialogOpen} onOpenChange={setLfgDialogOpen}>
        <DialogContent className="bg-[#0d0d12] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Post LFG</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {[
              { id: "lfg-game", label: "Game", key: "game", placeholder: "e.g. Valorant, League of Legends" },
              { id: "lfg-role", label: "Role / Position Needed", key: "role", placeholder: "e.g. Looking for Jungle Main" },
              { id: "lfg-rank", label: "Your Rank", key: "rank", placeholder: "e.g. Diamond 2" },
            ].map(({ id, label, key, placeholder }) => (
              <div key={key}>
                <label htmlFor={id} className="block text-sm text-[#a8b2bf] mb-1.5">
                  {label}
                </label>
                <input
                  id={id}
                  type="text"
                  placeholder={placeholder}
                  value={lfgForm[key as keyof typeof lfgForm]}
                  onChange={(e) => setLfgForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CE1126]/50 transition-colors"
                />
              </div>
            ))}

            <div>
              <label htmlFor="lfg-players" className="block text-sm text-[#a8b2bf] mb-1.5">
                Players Needed
              </label>
              <select
                id="lfg-players"
                value={lfgForm.playersNeeded}
                onChange={(e) => setLfgForm((f) => ({ ...f, playersNeeded: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CE1126]/50 transition-colors"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={String(n)} className="bg-[#0d0d12]">
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
              onClick={() => setLfgDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="submit-lfg-btn"
              className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
              onClick={handlePostLfg}
              disabled={!lfgForm.game || !lfgForm.role}
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
