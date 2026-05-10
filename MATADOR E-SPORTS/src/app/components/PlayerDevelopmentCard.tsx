import { FileVideo, MessageSquare, Award, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export function PlayerDevelopmentCard() {
  const skillData = [
    { subject: "Communication", value: 85, fullMark: 100 },
    { subject: "Aim", value: 78, fullMark: 100 },
    { subject: "Game Sense", value: 82, fullMark: 100 },
    { subject: "Positioning", value: 75, fullMark: 100 },
    { subject: "Teamwork", value: 90, fullMark: 100 },
    { subject: "Attendance", value: 95, fullMark: 100 },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl text-white">Player Development Profile</h3>
            <Badge className="bg-[#CE1126] text-white hover:bg-[#CE1126]">
              Coach's View
            </Badge>
          </div>
          <p className="text-sm text-[#a8b2bf]">
            Comprehensive player analysis and development tracking
          </p>
        </div>
        <Button 
          variant="outline"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
        >
          <Award className="h-4 w-4 mr-2" />
          Full Report
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="col-span-1">
          <h4 className="text-white mb-4 text-center">Skill Assessment</h4>
          <div className="bg-[#0d0d12] rounded-xl p-4 border border-white/10">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="#a8b2bf" strokeOpacity={0.2} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#a8b2bf', fontSize: 10 }}
                />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#CE1126"
                  fill="#CE1126"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-3 text-center">
              <p className="text-2xl text-[#CE1126]">84.2</p>
              <p className="text-xs text-[#a8b2bf]">Overall Rating</p>
            </div>
          </div>
        </div>

        {/* Coach's Notes */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-[#CE1126]" />
            <h4 className="text-white">Coach's Notes</h4>
          </div>
          <div className="space-y-3">
            <div className="bg-[#0d0d12] rounded-lg p-4 border border-white/10">
              <div className="flex items-start gap-2 mb-2">
                <Badge className="bg-green-500/20 text-green-400 text-xs">
                  Strength
                </Badge>
              </div>
              <p className="text-sm text-[#a8b2bf]">
                Excellent team communication and shotcalling. Natural leadership qualities 
                during scrimmages.
              </p>
            </div>
            <div className="bg-[#0d0d12] rounded-lg p-4 border border-white/10">
              <div className="flex items-start gap-2 mb-2">
                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                  Focus Area
                </Badge>
              </div>
              <p className="text-sm text-[#a8b2bf]">
                Work on crosshair placement and pre-aiming common angles. 
                Review VODs for positioning improvements.
              </p>
            </div>
            <div className="bg-[#0d0d12] rounded-lg p-4 border border-white/10">
              <div className="flex items-start gap-2 mb-2">
                <Badge className="bg-[#CE1126]/20 text-[#CE1126] text-xs">
                  Next Steps
                </Badge>
              </div>
              <p className="text-sm text-[#a8b2bf]">
                Ready for advanced scrim rotations. Consider for varsity sub roster.
              </p>
            </div>
          </div>
        </div>

        {/* VOD Reviews */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <FileVideo className="h-5 w-5 text-[#CE1126]" />
            <h4 className="text-white">VOD Reviews</h4>
          </div>
          <div className="space-y-2">
            {[
              { title: "Week 12 Scrimmage vs UCI", date: "Apr 1, 2026", reviewed: true },
              { title: "Ranked Session - Diamond Push", date: "Mar 28, 2026", reviewed: true },
              { title: "Tournament Finals - Game 3", date: "Mar 25, 2026", reviewed: false },
              { title: "Practice Drills - Aim Training", date: "Mar 20, 2026", reviewed: true },
            ].map((vod, index) => (
              <button
                key={index}
                className="w-full bg-[#0d0d12] hover:bg-white/5 border border-white/10 hover:border-[#CE1126]/50 rounded-lg p-3 text-left transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white text-sm group-hover:text-[#CE1126] transition-colors mb-1">
                      {vod.title}
                    </p>
                    <p className="text-xs text-[#a8b2bf]">{vod.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {vod.reviewed && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        ✓
                      </Badge>
                    )}
                    <ExternalLink className="h-4 w-4 text-[#a8b2bf] group-hover:text-[#CE1126] transition-colors" />
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <Button 
            className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white border border-white/10"
          >
            Upload New VOD
          </Button>
        </div>
      </div>
    </div>
  );
}
