import { Calendar, Users, Radio, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function CommunityFeed() {
  const feedItems = [
    {
      type: "event",
      title: "Spring LAN Party",
      date: "April 15, 2026",
      time: "6:00 PM - 11:00 PM",
      location: "University Student Union",
      game: "Multi-Game",
      attendees: 87,
      image: "https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGRlc2slMjBuZW9ufGVufDF8fHx8MTc3NTcxNzExNXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      type: "lfg",
      title: "Looking for Valorant Stack",
      author: "RedMatador",
      rank: "Diamond 2",
      game: "Valorant",
      role: "Looking for Support/Sentinel",
      players: "3/5",
    },
    {
      type: "stream",
      title: "Matadors vs UCLA Scrimmage",
      streamer: "MatadorEsportsTV",
      game: "League of Legends",
      viewers: 234,
      live: true,
    },
    {
      type: "lfg",
      title: "Need 1 for Ranked League",
      author: "MatadorGG",
      rank: "Gold 1",
      game: "League of Legends",
      role: "Looking for Jungle Main",
      players: "4/5",
    },
    {
      type: "event",
      title: "Rocket League Tournament",
      date: "April 20, 2026",
      time: "2:00 PM - 6:00 PM",
      location: "Online",
      game: "Rocket League",
      attendees: 32,
      image: "https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwc3R1ZGVudHMlMjB0ZWFtfGVufDF8fHx8MTc3NTcxNzExNnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      type: "stream",
      title: "Ranked Grind to Radiant",
      streamer: "MatadorAce",
      game: "Valorant",
      viewers: 89,
      live: true,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl text-white">Community Feed</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
          >
            All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
          >
            Events
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
          >
            LFG
          </Button>
        </div>
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-2 gap-4">
        {feedItems.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-[#CE1126]/50 transition-all cursor-pointer"
          >
            {item.type === "event" && "image" in item && (
              <div className="h-32 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white group-hover:text-[#CE1126] transition-colors">
                  {item.title}
                </h3>
                <Badge className="bg-[#CE1126]/20 text-[#CE1126] hover:bg-[#CE1126]/30 text-xs">
                  {item.game}
                </Badge>
              </div>

              {item.type === "event" && "date" in item && (
                <div className="space-y-1 text-sm text-[#a8b2bf]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{item.date} • {item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white mt-2">
                    <Users className="h-4 w-4 text-[#CE1126]" />
                    <span>{item.attendees} attending</span>
                  </div>
                </div>
              )}

              {item.type === "lfg" && "author" in item && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#a8b2bf]">
                    <span>by {item.author}</span>
                    <Badge variant="outline" className="text-xs border-[#a8b2bf]/50">
                      {item.rank}
                    </Badge>
                  </div>
                  <p className="text-white">{item.role}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[#a8b2bf]">{item.players} Players</span>
                    <Button 
                      size="sm"
                      className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white h-7 text-xs"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              )}

              {item.type === "stream" && "streamer" in item && (
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
                    <Button 
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white h-7 text-xs border border-white/20"
                    >
                      Watch
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
