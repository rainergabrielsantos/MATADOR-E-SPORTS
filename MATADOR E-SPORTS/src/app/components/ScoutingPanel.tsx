import { Target, Trophy, Zap, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function ScoutingPanel() {
  const bounties = [
    {
      game: "Valorant",
      role: "Sentinel",
      rank: "Ascendant+",
      priority: "High",
      color: "#CE1126",
    },
    {
      game: "League of Legends",
      role: "Jungle Main",
      rank: "Platinum+",
      priority: "Medium",
      color: "#a8b2bf",
    },
    {
      game: "Rocket League",
      role: "Any Position",
      rank: "Champion+",
      priority: "High",
      color: "#CE1126",
    },
  ];

  const myStats = [
    { label: "Peak Rank", value: "Diamond 3", change: "+2" },
    { label: "Win Rate", value: "58.3%", change: "+4.2%" },
    { label: "KD Ratio", value: "1.87", change: "+0.15" },
    { label: "Hours Played", value: "247", change: "+18" },
  ];

  return (
    <div className="space-y-6">
      {/* Scouting Radar Header */}
      <div className="bg-gradient-to-br from-[#CE1126]/20 to-transparent border border-[#CE1126]/30 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-[#CE1126]/20 rounded-lg">
            <Target className="h-6 w-6 text-[#CE1126]" />
          </div>
          <h2 className="text-2xl text-white">Scouting Radar</h2>
        </div>
        <p className="text-[#a8b2bf] text-sm">
          Varsity coaches are actively recruiting. See what positions are available and apply directly.
        </p>
      </div>

      {/* Active Bounties */}
      <div>
        <h3 className="text-white mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#CE1126]" />
          Active Recruitment
        </h3>
        <div className="space-y-3">
          {bounties.map((bounty, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-[#CE1126]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white mb-1">{bounty.game}</p>
                  <p className="text-sm text-[#a8b2bf]">{bounty.role}</p>
                </div>
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: `${bounty.color}20`,
                    color: bounty.color,
                  }}
                >
                  {bounty.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-[#a8b2bf]">Min. Rank: {bounty.rank}</span>
                <Zap className="h-4 w-4" style={{ color: bounty.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Stats Card */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <h3 className="text-white mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#CE1126]" />
          My Performance
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {myStats.map((stat, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-[#a8b2bf] mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-white text-lg">{stat.value}</p>
                <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20 text-xs h-5">
                  {stat.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply CTA */}
      <div className="bg-gradient-to-br from-[#CE1126] to-[#CE1126]/80 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <h3 className="text-white text-lg mb-2">Ready for Varsity?</h3>
          <p className="text-white/80 text-sm mb-4">
            Submit your gaming profiles and let coaches discover your potential.
          </p>
          <Button className="w-full bg-white text-[#CE1126] hover:bg-white/90">
            Apply for Tryout
          </Button>
        </div>
      </div>
    </div>
  );
}
