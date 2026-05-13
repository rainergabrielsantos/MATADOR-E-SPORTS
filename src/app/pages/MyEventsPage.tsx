import { useAuth } from "../hooks/useAuth";
import { useEvents } from "../hooks/useEvents";
import { PageHeader } from "../components/PageHeader";
import { Calendar, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { NavLink } from "react-router";

export function MyEventsPage() {
  const { user } = useAuth();
  const { events, rsvps, toggleRSVP, loading } = useEvents(user?.id);

  const rsvpEvents = events.filter(e => rsvps.includes(e.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CE1126]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <PageHeader
        title="My Matador Events"
        backTo="/dashboard/community"
        backLabel="Community Hub"
      />

      {rsvpEvents.length === 0 ? (
        <div className="text-center py-24 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10 space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="h-10 w-10 text-white/20" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white uppercase italic">Your schedule is <span className="text-[#CE1126]">clear</span></h2>
            <p className="text-[#a8b2bf] max-w-md mx-auto">You haven't RSVP'd for any events yet. Check out the Community Hub to find upcoming hangouts!</p>
          </div>
          <NavLink to="/dashboard/community">
            <Button className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white rounded-xl px-10 py-6 font-bold uppercase tracking-widest mt-4">
              Explore Community Hub
            </Button>
          </NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rsvpEvents.map((event) => (
            <div key={event.id} className="group relative bg-[#131318] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-[#CE1126]/50 transition-all shadow-2xl flex flex-col">
              <div className="aspect-[21/9] w-full bg-white/5 relative overflow-hidden">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-6xl italic select-none">
                    {event.game || "MATADOR"}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131318] to-transparent opacity-80" />
                <Badge className="absolute top-6 right-6 bg-[#CE1126] text-white border-none uppercase text-[10px] font-black tracking-widest px-4 py-1.5 shadow-lg">
                  {event.game}
                </Badge>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white leading-tight uppercase italic">{event.title}</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-xs text-[#a8b2bf] uppercase font-bold tracking-widest">
                      <div className="p-2 bg-[#CE1126]/10 rounded-lg"><Calendar className="h-4 w-4 text-[#CE1126]" /></div>
                      {event.date} @ {event.time}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#a8b2bf] uppercase font-bold tracking-widest">
                      <div className="p-2 bg-[#CE1126]/10 rounded-lg"><MapPin className="h-4 w-4 text-[#CE1126]" /></div>
                      {event.location}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <NavLink to="/dashboard/community" className="flex-1">
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white hover:bg-white/5 uppercase font-bold text-[10px] tracking-widest">
                      View Hub Post <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </NavLink>
                  <Button 
                    onClick={() => toggleRSVP(event.id)}
                    className="flex-1 h-14 rounded-2xl bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all font-black uppercase text-[10px] tracking-widest group"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 group-hover:hidden" />
                    <span className="group-hover:hidden">Confirmed</span>
                    <span className="hidden group-hover:inline">Cancel RSVP</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
