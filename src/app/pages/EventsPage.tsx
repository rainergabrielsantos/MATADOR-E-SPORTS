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
import { useEvents } from "../hooks/useEvents";
import { toast } from "sonner";

type EventTab = "upcoming" | "scrims" | "myrsvps";

const roles = ["Entry Fragger", "Support", "IGL", "AWPer", "Lurker", "Any Role"];

export function EventsPage() {
  const { events, rsvps, toggleRSVP } = useEvents();
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const [joinScrimOpen, setJoinScrimOpen] = useState(false);
  const [selectedScrim, setSelectedScrim] = useState<any>(null);
  const [scrimRole, setScrimRole] = useState(roles[0]);
  const [scrimIgName, setScrimIgName] = useState("");

  const tabs: { id: EventTab; label: string }[] = [
    { id: "upcoming", label: "Upcoming Events" },
    { id: "scrims", label: "Open Scrims" },
    { id: "myrsvps", label: "My RSVPs" },
  ];

  const filtered = events.filter((e) => {
    const isRsvpd = rsvps.includes(e.id);
    if (activeTab === "myrsvps") return isRsvpd;
    // For this demo, let's say Scrims are events with "Scrim" in the title or a specific property
    // Since our hook has a simple structure, I'll filter by title content
    const isScrim = e.title.toLowerCase().includes("scrim") || e.title.toLowerCase().includes("tryout");
    if (activeTab === "upcoming") return !isScrim;
    if (activeTab === "scrims") return isScrim;
    return true;
  });

  const handleToggleRsvp = (eventId: string) => {
    toggleRSVP(eventId);
    const isJoining = !rsvps.includes(eventId);
    if (isJoining) {
      toast.success("RSVP confirmed! See you there.");
    } else {
      toast.info("RSVP cancelled.");
    }
  };

  const openJoinScrim = (event: any) => {
    setSelectedScrim(event);
    setScrimRole(roles[0]);
    setScrimIgName("");
    setJoinScrimOpen(true);
  };

  const handleJoinScrim = () => {
    if (!selectedScrim) return;
    toggleRSVP(selectedScrim.id);
    toast.success(`Joined scrim as ${scrimRole}!`);
    setJoinScrimOpen(false);
  };

  const capacityColor = (attending: number, max: number = 100) => {
    const pct = attending / max;
    if (pct >= 0.9) return "#ef4444";
    if (pct >= 0.7) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Events & Scrimmages"
        subtitle="RSVP to campus events and join open scrim blocks."
        backTo="/dashboard"
        backLabel="Home"
      />

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/20"
                : "bg-white/5 border border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.id === "myrsvps" && rsvps.length > 0 && (
              <span className="ml-2 bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5">
                {rsvps.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event) => {
          const isRsvpd = rsvps.includes(event.id);
          const isScrim = event.title.toLowerCase().includes("scrim") || event.title.toLowerCase().includes("tryout");
          const maxAttendees = isScrim ? 10 : 120;
          const capColor = capacityColor(event.attendeesCount, maxAttendees);

          return (
            <div
              key={event.id}
              className="group bg-[#131318] border border-white/10 rounded-2xl overflow-hidden hover:border-[#CE1126]/50 transition-all flex flex-col"
            >
              {event.image && (
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131318] to-transparent opacity-60" />
                  <Badge className="absolute top-3 right-3 bg-[#CE1126] text-white border-none">
                    {event.game}
                  </Badge>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col space-y-4">
                <h3 className="text-lg font-bold text-white group-hover:text-[#CE1126] transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2 text-xs text-[#a8b2bf]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#CE1126]" />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#CE1126]" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-xs text-[#a8b2bf] leading-relaxed flex-1 italic">
                  {event.description}
                </p>

                {/* Capacity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-[#a8b2bf]">Capacity</span>
                    <span style={{ color: capColor }}>{event.attendeesCount} / {maxAttendees} Spots</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.min((event.attendeesCount / maxAttendees) * 100, 100)}%`,
                        backgroundColor: capColor 
                      }}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => isScrim ? (isRsvpd ? handleToggleRsvp(event.id) : openJoinScrim(event)) : handleToggleRsvp(event.id)}
                  className={`w-full h-11 gap-2 ${
                    isRsvpd 
                      ? "bg-white/5 hover:bg-red-500/20 text-white border border-white/10 hover:border-red-500/50" 
                      : "bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
                  }`}
                >
                  {isRsvpd ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      RSVP'd (Cancel)
                    </>
                  ) : (
                    <>
                      {isScrim ? <Swords className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {isScrim ? "Join Scrim" : "RSVP Now"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
          <Calendar className="h-12 w-12 text-white/10 mx-auto mb-4" />
          <p className="text-[#a8b2bf] font-medium">No events found in this category.</p>
        </div>
      )}

      {/* Join Scrim Dialog */}
      <Dialog open={joinScrimOpen} onOpenChange={setJoinScrimOpen}>
        <DialogContent className="bg-[#131318] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase italic">
              Join <span className="text-[#CE1126]">Scrim</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#a8b2bf] uppercase">Selected Scrim</label>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm">
                {selectedScrim?.title}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#a8b2bf] uppercase">Your Role</label>
              <Select value={scrimRole} onValueChange={setScrimRole}>
                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-white/10 text-white">
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#a8b2bf] uppercase">In-Game Name / Tag</label>
              <Input
                placeholder="e.g. MatadorX#1234"
                value={scrimIgName}
                onChange={(e) => setScrimIgName(e.target.value)}
                className="bg-white/5 border-white/10 h-11"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button variant="ghost" onClick={() => setJoinScrimOpen(false)} className="text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button
              onClick={handleJoinScrim}
              className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white px-8"
              disabled={!scrimIgName.trim()}
            >
              Confirm Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
