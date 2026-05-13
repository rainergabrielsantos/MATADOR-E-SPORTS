import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Calendar, MapPin, Users, Swords, Plus, CheckCircle2, Circle, ArrowLeft, ExternalLink, Zap } from "lucide-react";
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
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { NavLink } from "react-router";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export function EventsPage() {
  const { user } = useAuth();
  const { events, rsvps, toggleRSVP, loading } = useEvents(user?.id);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleToggleRsvp = (eventId: string) => {
    toggleRSVP(eventId);
    const isJoining = !rsvps.includes(eventId);
    if (isJoining) {
      toast.success("RSVP confirmed! Added to My Events.");
    } else {
      toast.info("RSVP cancelled.");
    }
  };

  const seedEvents = async () => {
    setIsSeeding(true);
    const fabricatedEvents = [
      {
        title: "CSUN E-Sports Kickoff Mixer",
        description: "Meet the teams, play some friendlies, and grab some free food! Open to all majors.",
        date: "Oct 25, 2026",
        time: "6:00 PM",
        location: "USU Game Console Room",
        game: "General",
        attendeesCount: 45,
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"
      },
      {
        title: "Valorant Varsity Tryouts",
        description: "Are you Radiant material? Come show off your skills for a spot on the official Matador Varsity squad.",
        date: "Oct 26, 2026",
        time: "2:00 PM",
        location: "CSUN Discord / Online",
        game: "Valorant",
        attendeesCount: 12,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: "Super Smash Bros Monthly",
        description: "Our signature monthly tournament. $5 entry, pot goes to top 3. Double elimination.",
        date: "Nov 01, 2026",
        time: "5:00 PM",
        location: "Northridge Center",
        game: "Super Smash Bros.",
        attendeesCount: 32,
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
      }
    ];

    try {
      for (const e of fabricatedEvents) {
        await addDoc(collection(db, "events"), e);
      }
      toast.success("Fabricated CSUN events seeded successfully!");
    } catch (err) {
      toast.error("Failed to seed events.");
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
        title="CSUN Campus Events"
        subtitle="Discover tournaments,official Esports events and casual hangouts with other Matadors."
        backTo="/dashboard/community"
        backLabel="Community Hub"
        action={
          <div className="flex gap-3">
            {events.length === 0 && (
              <Button 
                variant="outline" 
                className="border-[#CE1126]/20 text-[#CE1126] hover:bg-[#CE1126]/10"
                onClick={seedEvents}
                disabled={isSeeding}
              >
                <Zap className="h-4 w-4 mr-2" /> {isSeeding ? "Seeding..." : "Seed Club Events"}
              </Button>
            )}
            <NavLink to="/dashboard/my-events">
              <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]">
                Manage My RSVPs
              </Button>
            </NavLink>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events.map((event) => (
          <div key={event.id} className="group flex flex-col md:flex-row bg-[#131318] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-[#CE1126]/50 transition-all shadow-2xl">
            <div className="md:w-2/5 aspect-video md:aspect-auto relative overflow-hidden bg-white/5">
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-6xl italic select-none">
                  {event.game || "MATADOR"}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#131318] to-transparent opacity-40 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131318] to-transparent opacity-60 md:hidden" />
              <Badge className="absolute top-6 left-6 bg-[#CE1126] text-white border-none uppercase text-[10px] font-black tracking-widest px-4 py-1.5 shadow-lg">
                {event.game}
              </Badge>
            </div>

            <div className="md:w-3/5 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#CE1126] font-black text-[10px] uppercase tracking-[0.2em]">
                  <Circle className="h-2 w-2 fill-[#CE1126] animate-pulse" /> Official Club Event
                </div>
                <h3 className="text-3xl font-black text-white leading-none uppercase italic tracking-tight">{event.title}</h3>
                <p className="text-sm text-[#a8b2bf] leading-relaxed line-clamp-3">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-3 text-[10px] text-white font-bold uppercase tracking-widest">
                    <div className="p-2 bg-[#CE1126]/10 rounded-lg"><Calendar className="h-4 w-4 text-[#CE1126]" /></div>
                    {event.date} @ {event.time}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white font-bold uppercase tracking-widest">
                    <div className="p-2 bg-[#CE1126]/10 rounded-lg"><MapPin className="h-4 w-4 text-[#CE1126]" /></div>
                    {event.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <Button 
                  onClick={() => handleToggleRsvp(event.id)}
                  className={`flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                    rsvps.includes(event.id)
                      ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                      : "bg-[#CE1126] text-white hover:bg-[#CE1126]/90 shadow-lg shadow-[#CE1126]/20"
                  }`}
                >
                  {rsvps.includes(event.id) ? (
                    <><CheckCircle2 className="h-4 w-4 mr-2" /> Registered</>
                  ) : (
                    <>Register for Event</>
                  )}
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-white/10 text-[#a8b2bf] hover:text-white hover:bg-white/5">
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-24 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10 space-y-6">
          <Calendar className="h-16 w-16 text-white/5 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase italic">No campus events <span className="text-[#CE1126]">detected</span></h2>
            <p className="text-[#a8b2bf] max-w-md mx-auto text-sm">Matador E-Sports is currently planning the next set of mixers and tournaments. Check back soon!</p>
          </div>
          <Button onClick={seedEvents} disabled={isSeeding} variant="outline" className="border-[#CE1126]/30 text-[#CE1126] hover:bg-[#CE1126]/10 rounded-xl px-8 h-12 font-bold uppercase tracking-widest">
            {isSeeding ? "Generating..." : "Generate Sample Events"}
          </Button>
        </div>
      )}
    </div>
  );
}
