import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTickets } from "../hooks/useTickets";
import { PageHeader } from "../components/PageHeader";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Star,
  ChevronRight
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

// Sample improvement data
const skillData = [
  { month: "Jan", aim: 65, sense: 40, mental: 70 },
  { month: "Feb", aim: 68, sense: 45, mental: 72 },
  { month: "Mar", aim: 75, sense: 55, mental: 70 },
  { month: "Apr", aim: 82, sense: 60, mental: 75 },
  { month: "May", aim: 85, sense: 70, mental: 80 },
  { month: "Jun", aim: 88, sense: 78, mental: 85 },
];

export function PathToPro() {
  const { user } = useAuth();
  const { tickets, loading } = useTickets();
  const [activeMetric, setActiveMetric] = useState<"aim" | "sense" | "mental">("aim");

  const playerTickets = tickets.filter(t => t.player_id === user?.id && t.status === "Completed");

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
        title="Path To Pro"
        subtitle="Varsity Elite: Performance metrics, coach feedback, and developmental tracking."
        backTo="/dashboard"
        backLabel="Dashboard"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Graph Card */}
        <div className="lg:col-span-2 bg-[#131318] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-2xl shadow-lg shadow-blue-500/10">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-wider text-white">Skill <span className="text-blue-400">Growth</span></h2>
                <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-widest">Aggregated Performance Index</p>
              </div>
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {(["aim", "sense", "mental"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeMetric === m ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "text-[#a8b2bf] hover:text-white"
                  }`}
                >
                  {m === "sense" ? "Game Sense" : m}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={skillData}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#a8b2bf" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#a8b2bf" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeMetric} 
                  stroke="#60a5fa" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-widest mb-1">Current Aim</p>
              <p className="text-2xl font-black text-white italic">88%</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-widest mb-1">Game Sense</p>
              <p className="text-2xl font-black text-blue-400 italic">78%</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-[#a8b2bf] uppercase font-bold tracking-widest mb-1">Mental</p>
              <p className="text-2xl font-black text-white italic">85%</p>
            </div>
          </div>
        </div>

        {/* Coach Assignments & Feedback */}
        <div className="space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#CE1126]/20 rounded-lg">
                <Target className="h-5 w-5 text-[#CE1126]" />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-wider text-white">Coach <span className="text-[#CE1126]">Assignments</span></h3>
            </div>

            <div className="space-y-4">
              <div className="bg-[#131318] border border-[#CE1126]/30 rounded-[1.5rem] p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-start">
                  <Badge className="bg-[#CE1126]/10 text-[#CE1126] border-none uppercase font-black text-[10px] tracking-widest">Priority Goal</Badge>
                  <Zap className="h-5 w-5 text-[#CE1126] animate-pulse" />
                </div>
                <h4 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">Master Initiator Lineups</h4>
                <p className="text-sm text-[#a8b2bf] leading-relaxed">
                  Focus on Ascent Sova darts. Need 100% consistency on A-site retake arrows by next scrimmage.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=CoachK" />
                      <AvatarFallback>CK</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Coach K</span>
                  </div>
                  <Button variant="outline" className="h-8 text-[10px] uppercase font-black tracking-widest border-white/10 hover:bg-[#CE1126] hover:text-white">Complete</Button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-wider text-white">Recent <span className="text-green-400">Feedback</span></h3>
            </div>

            <div className="space-y-4">
              {playerTickets.length === 0 ? (
                <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[1.5rem] p-8 text-center space-y-3">
                  <Star className="h-8 w-8 text-white/10 mx-auto" />
                  <p className="text-[10px] text-[#a8b2bf] font-black uppercase tracking-widest leading-relaxed">Submit a VOD to receive specialized feedback from your coach.</p>
                </div>
              ) : (
                playerTickets.map(ticket => (
                  <div key={ticket.id} className="bg-[#131318] border border-white/10 rounded-[1.5rem] p-6 hover:border-green-500/40 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <Badge className="bg-green-500/10 text-green-500 border-none uppercase text-[10px]">{ticket.game}</Badge>
                        <h4 className="text-white font-bold tracking-tight uppercase tracking-widest text-xs">{ticket.helpType}</h4>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-sm text-[#a8b2bf] italic line-clamp-3 mb-4 leading-relaxed group-hover:text-white transition-colors">
                      "{ticket.feedback || "No feedback provided yet."}"
                    </p>
                    <Button variant="link" className="p-0 text-[#CE1126] text-[10px] font-black uppercase tracking-widest h-auto">
                      View Full Review <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
