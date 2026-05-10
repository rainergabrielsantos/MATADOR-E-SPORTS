import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Calendar, MapPin, Users, Swords, Plus, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

type EventTab = "upcoming" | "scrims" | "myrsvps";

interface GameEvent {
  id: string;
  type: "event" | "scrim";
  title: string;
  date: string;
  time: string;
  location: string;
  game: string;
  attendees: number;
  maxAttendees?: number;
  image?: string;
  description?: string;
}

const allEvents: GameEvent[] = [
  {
    id: "e1",
    type: "event",
    title: "Spring LAN Party",
    date: "April 15, 2026",
    time: "6:00 PM – 11:00 PM",
    location: "University Student Union",
    game: "Multi-Game",
    attendees: 87,
    maxAttendees: 120,
    description:
      "CSUN's biggest LAN of the semester. Bring your peripherals and compete across 5 titles.",
    image:
      "https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    id: "e2",
    type: "event",
    title: "Rocket League Tournament",
    date: "April 20, 2026",
    time: "2:00 PM – 6:00 PM",
    location: "Online",
    game: "Rocket League",
    attendees: 32,
    maxAttendees: 64,
    description:
      "Double-elimination bracket. 3v3 format. Prizes for top 3 teams.",
  },
  {
    id: "e3",
    type: "scrim",
    title: "Open Valorant Scrim Block",
    date: "April 17, 2026",
    time: "7:00 PM – 10:00 PM",
    location: "Online (Discord)",
    game: "Valorant",
    attendees: 8,
    maxAttendees: 10,
    description:
      "Open scrim slots for Valorant players. Diamond+ preferred but all welcome.",
  },
  {
    id: "e4",
    type: "scrim",
    title: "League of Legends Inhouse",
    date: "April 18, 2026",
    time: "5:00 PM – 9:00 PM",
    location: "Online (Discord)",
    game: "League of Legends",
    attendees: 14,
    maxAttendees: 20,
    description:
      "Inhouse tournament for all CSUN LoL players. Sign up by 4 PM day of.",
  },
  {
    id: "e5",
    type: "event",
    title: "CS2 Charity Cup",
    date: "May 3, 2026",
    time: "1:00 PM – 8:00 PM",
    location: "Campus Recreation Center",
    game: "CS2",
    attendees: 45,
    maxAttendees: 80,
    description:
      "Fundraiser tournament supporting CSUN student wellness programs.",
  },
];

// Scrim join form
const roles = ["Entry Fragger", "Support", "IGL", "AWPer", "Lurker", "Any Role"];

export function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const [rsvpd, setRsvpd] = useState<Set<string>>(new Set());
  const [joinScrimOpen, setJoinScrimOpen] = useState(false);
  const [selectedScrim, setSelectedScrim] = useState<GameEvent | null>(null);
  const [scrimRole, setScrimRole] = useState(roles[0]);
  const [scrimIgName, setScrimIgName] = useState("");
  const [joinedScrims, setJoinedScrims] = useState<Set<string>>(new Set());

  const tabs: { id: EventTab; label: string }[] = [
    { id: "upcoming", label: "Upcoming Events" },
    { id: "scrims", label: "Open Scrims" },
    { id: "myrsvps", label: "My RSVPs" },
  ];

  const filtered = allEvents.filter((e) => {
    if (activeTab === "upcoming") return e.type === "event";
    if (activeTab === "scrims") return e.type === "scrim";
    if (activeTab === "myrsvps") return rsvpd.has(e.id) || joinedScrims.has(e.id);
    return true;
  });

  function toggleRsvp(id: string) {
    setRsvpd((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openJoinScrim(event: GameEvent) {
    setSelectedScrim(event);
    setScrimRole(roles[0]);
    setScrimIgName("");
    setJoinScrimOpen(true);
  }

  function handleJoinScrim() {
    if (!selectedScrim) return;
    // TODO: replace with API call
    console.log("Join scrim:", { scrim: selectedScrim.id, role: scrimRole, igName: scrimIgName });
    setJoinedScrims((prev) => {
      const next = new Set(prev);
      next.add(selectedScrim.id);
      return next;
    });
    setJoinScrimOpen(false);
  }

  const capacityColor = (attending: number, max?: number) => {
    if (!max) return "#a8b2bf";
    const pct = attending / max;
    if (pct >= 0.9) return "#ef4444";
    if (pct >= 0.7) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Events & Scrimmages"
        subtitle="RSVP to campus events and join open scrim blocks."
        backTo="/dashboard"
        backLabel="Home"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`events-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/20"
                : "bg-white/5 border border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.id === "myrsvps" && rsvpd.size + joinedScrims.size > 0 && (
              <span className="ml-2 bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5">
                {rsvpd.size + joinedScrims.size}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="h-10 w-10 text-[#a8b2bf] mx-auto mb-4" />
          <p className="text-white font-semibold mb-1">No items here yet</p>
          <p className="text-[#a8b2bf] text-sm">
            {activeTab === "myrsvps"
              ? "RSVP to events or join a scrim to see them here."
              : "Check back soon!"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((event) => {
          const isRsvpd = rsvpd.has(event.id);
          const isJoined = joinedScrims.has(event.id);
          const capColor = capacityColor(event.attendees, event.maxAttendees);

          return (
            <div
              key={event.id}
              className="group bg-[#0d0d12] border border-white/10 rounded-xl overflow-hidden hover:border-[#CE1126]/40 transition-all"
            >
              {event.image && (
                <div className="h-36 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-5">
                {/* Title + game badge */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold group-hover:text-[#CE1126] transition-colors pr-2">
                    {event.title}
                  </h3>
                  <Badge className="bg-[#CE1126]/20 text-[#CE1126] hover:bg-[#CE1126]/30 text-xs flex-shrink-0">
                    {event.game}
                  </Badge>
                </div>

                {/* Meta info */}
                <div className="space-y-1.5 text-sm text-[#a8b2bf] mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      {event.date} · {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {event.description && (
                  <p className="text-[#a8b2bf] text-xs mb-4 leading-relaxed">
                    {event.description}
                  </p>
                )}

                {/* Capacity bar */}
                {event.maxAttendees && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1 text-[#a8b2bf]">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees} / {event.maxAttendees} spots</span>
                      </div>
                      <span style={{ color: capColor }} className="font-medium">
                        {Math.round((event.attendees / event.maxAttendees) * 100)}% full
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(event.attendees / event.maxAttendees) * 100}%`,
                          backgroundColor: capColor,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action button */}
                {event.type === "event" && (
                  <button
                    id={`rsvp-${event.id}`}
                    onClick={() => toggleRsvp(event.id)}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      isRsvpd
                        ? "bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-red-900/20 hover:text-red-400 hover:border-red-600/30"
                        : "bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
                    }`}
                  >
                    {isRsvpd ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        RSVP'd — Click to Cancel
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4" />
                        RSVP
                      </>
                    )}
                  </button>
                )}

                {event.type === "scrim" && (
                  <button
                    id={`join-scrim-${event.id}`}
                    onClick={() =>
                      isJoined ? null : openJoinScrim(event)
                    }
                    disabled={isJoined}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      isJoined
                        ? "bg-green-600/20 text-green-400 border border-green-600/30 cursor-default"
                        : "bg-white/10 hover:bg-[#CE1126] text-white border border-white/20 hover:border-[#CE1126]"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Joined
                      </>
                    ) : (
                      <>
                        <Swords className="h-4 w-4" />
                        Join Scrim
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Join Scrim Dialog */}
      <Dialog open={joinScrimOpen} onOpenChange={setJoinScrimOpen}>
        <DialogContent className="bg-[#0d0d12] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Join Scrim: {selectedScrim?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="scrim-role" className="block text-sm text-[#a8b2bf] mb-1.5">
                Your Role
              </label>
              <select
                id="scrim-role"
                value={scrimRole}
                onChange={(e) => setScrimRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CE1126]/50 transition-colors"
              >
                {roles.map((r) => (
                  <option key={r} value={r} className="bg-[#0d0d12]">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="scrim-igname" className="block text-sm text-[#a8b2bf] mb-1.5">
                In-Game Name / Tag
              </label>
              <input
                id="scrim-igname"
                type="text"
                placeholder="e.g. MatadorX#1234"
                value={scrimIgName}
                onChange={(e) => setScrimIgName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CE1126]/50 transition-colors"
              />
            </div>

            <div className="bg-white/5 rounded-lg p-3 text-xs text-[#a8b2bf]">
              <p className="font-medium text-white mb-1">What happens next?</p>
              <p>You'll be added to the scrim roster. Check Discord for the lobby code closer to the event time.</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
              onClick={() => setJoinScrimOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="confirm-join-scrim-btn"
              className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
              onClick={handleJoinScrim}
              disabled={!scrimIgName.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Confirm Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
