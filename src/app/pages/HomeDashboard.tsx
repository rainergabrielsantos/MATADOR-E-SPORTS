import { HeroBanner } from "../components/HeroBanner";
import { QuickCard } from "../components/QuickCard";
import { StatPill } from "../components/StatPill";
import { Trophy, Swords, Users, Radio, Calendar, MessageSquare } from "lucide-react";
import { Badge } from "../components/ui/badge";

// Mock live streams — in a real app this would come from an API
const liveStreams = [
  {
    id: "stream-1",
    title: "CSUN vs UCLA Scrimmage",
    streamer: "CSUNEsportsTV",
    game: "League of Legends",
    viewers: 234,
  },
  {
    id: "stream-2",
    title: "Ranked Grind to Radiant",
    streamer: "MatadorAce",
    game: "Valorant",
    viewers: 89,
  },
];

export function HomeDashboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <HeroBanner />

      {/* Today's Snapshot — read-only stat pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        <StatPill
          icon={Calendar}
          value="2"
          label="events this week"
          accentColor="#CE1126"
        />
        <StatPill
          icon={MessageSquare}
          value="7"
          label="active LFG posts"
          accentColor="#a8b2bf"
        />
        <StatPill
          icon={Radio}
          value={liveStreams.length}
          label="live now"
          accentColor="#CE1126"
          pulse
        />
      </div>

      {/* 3-Column Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickCard
          icon={Trophy}
          title="The Pro Pipeline"
          subtitle="Glory, Greatness, Guts"
          metric="50%"
          metricLabel="Progress to next milestone"
          ctaLabel="View Tracker"
          to="/dashboard/path-to-pro"
          accentColor="#CE1126"
        />
        <QuickCard
          icon={Swords}
          title="Events & Scrimmages"
          subtitle="Upcoming matches & LANs"
          metric="2"
          metricLabel="Events this week"
          ctaLabel="Browse Events"
          to="/dashboard/events"
          accentColor="#a8b2bf"
        />
        <QuickCard
          icon={Users}
          title="Community Hub"
          subtitle="LFG, streams & feed"
          metric="7"
          metricLabel="Open LFG posts"
          ctaLabel="Browse Community"
          to="/dashboard/community"
          accentColor="#CE1126"
        />
      </div>

      {/* Live Now Rail */}
      {liveStreams.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Radio className="h-4 w-4 text-[#CE1126] animate-pulse" />
            <h2 className="text-white font-semibold">Live Now</h2>
            <Badge className="bg-[#CE1126] text-white hover:bg-[#CE1126] text-xs">
              LIVE
            </Badge>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {liveStreams.map((stream) => (
              <a
                key={stream.id}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex-shrink-0 w-64 bg-[#0d0d12] border border-white/10 rounded-xl p-4 hover:border-[#CE1126]/50 hover:bg-white/5 transition-all group"
              >
                {/* Live indicator bar */}
                <div className="h-1 bg-gradient-to-r from-[#CE1126] to-[#CE1126]/30 rounded-full mb-3" />
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium group-hover:text-[#CE1126] transition-colors truncate">
                      {stream.title}
                    </p>
                    <p className="text-[#a8b2bf] text-xs mt-0.5">
                      {stream.streamer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge className="bg-[#CE1126]/20 text-[#CE1126] hover:bg-[#CE1126]/30 text-xs">
                    {stream.game}
                  </Badge>
                  <div className="flex items-center gap-1 text-[#a8b2bf] text-xs">
                    <Users className="h-3 w-3" />
                    <span>{stream.viewers}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
