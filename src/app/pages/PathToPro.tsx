import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTickets } from "../hooks/useTickets";
import { usePlayerStats } from "../hooks/usePlayerStats";
import { PageHeader } from "../components/PageHeader";
import { useNavigate } from "react-router";
import { 
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
  ChevronRight,
  AlertCircle,
  Gamepad2,
  Shield,
  Layers,
  Activity,
  History,
  ExternalLink,
  Video
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { AnimatedProgressBar } from "../components/ui/StarRating";
import { GAME_METRICS_MAP } from "../../lib/gameMetrics";

export function PathToPro() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tickets, loading: ticketsLoading } = useTickets();
  const { stats, loading: statsLoading } = usePlayerStats(user?.id);
  const [selectedGame, setSelectedGame] = useState<string>("Valorant");
  const [activeMetric, setActiveMetric] = useState<string>("aim");

  const playerTickets = useMemo(() => 
    tickets.filter(t => t.player_id === user?.id && t.game === selectedGame && t.status === "Completed"),
    [tickets, user, selectedGame]
  );

  const gameStats = useMemo(() => stats?.games?.[selectedGame] || null, [stats, selectedGame]);
  const gameMetrics = useMemo(() => GAME_METRICS_MAP[selectedGame] || GAME_METRICS_MAP["Default"], [selectedGame]);

  const chartData = useMemo(() => {
    if (!gameStats || !gameStats.history || gameStats.history.length === 0) return [];
    return gameStats.history.map(h => ({
      ...h.metrics,
      month: new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
    }));
  }, [gameStats]);

  const availableMetrics = useMemo(() => {
    return [...gameMetrics.gameSkills.map(s => s.name)];
  }, [gameMetrics]);

  // Set default active metric when game changes
  useEffect(() => {
    if (!availableMetrics.includes(activeMetric)) {
      setActiveMetric(availableMetrics[0] || "aim");
    }
  }, [availableMetrics, activeMetric]);

  if (ticketsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CE1126]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <PageHeader
          title="Pro Pipeline"
          subtitle="Evolution of Elite Performance"
          backTo="/dashboard"
          backLabel="Dashboard"
        />
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[2rem] border border-white/10 shadow-2xl">
           {Object.keys(GAME_METRICS_MAP).filter(g => g !== "Default").map(game => (
             <button
               key={game}
               onClick={() => setSelectedGame(game)}
               className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 selectedGame === game 
                   ? "bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/20" 
                   : "text-white/40 hover:text-white hover:bg-white/5"
               }`}
             >
               {game}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: SKILL TREE & METRICS */}
        <div className="xl:col-span-8 space-y-10">
           {/* Gamer Skill Tree / Radar Chart Alternative */}
           <div className="bg-[#0a0a0c] border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#CE1126]/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-[#CE1126]/20 rounded-2xl">
                      <Layers className="h-6 w-6 text-[#CE1126]" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Gamer <span className="text-[#CE1126]">Skill Tree</span></h2>
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Permanent DNA Calibration - {selectedGame}</p>
                   </div>
                </div>
                <Button 
                  onClick={() => navigate("/dashboard/pro-pipeline-submission")}
                  className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white gap-2 shadow-lg shadow-[#CE1126]/20 px-8 h-12 rounded-xl font-black uppercase tracking-widest text-xs"
                >
                  <Video className="h-4 w-4" />
                  Initiate Review
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Game Skills Tree */}
                <div className="space-y-8">
                   <div className="flex items-center gap-3 px-2">
                      <Gamepad2 className="h-4 w-4 text-[#CE1126]" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Core Foundations</h3>
                   </div>
                   <div className="grid grid-cols-1 gap-6">
                      {gameMetrics.gameSkills.map(skill => (
                        <div key={skill.name} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-4 hover:border-[#CE1126]/40 transition-all group">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h4 className="text-white font-black uppercase text-sm tracking-tight group-hover:text-[#CE1126] transition-colors">{skill.label}</h4>
                                 <p className="text-[9px] text-white/20 font-medium leading-tight mt-1">{skill.description}</p>
                              </div>
                              <span className="text-xl font-black text-white italic">{(gameStats?.current?.[skill.name] || 0).toFixed(1)}</span>
                           </div>
                           <AnimatedProgressBar value={gameStats?.current?.[skill.name] || 0} max={5} color="bg-[#CE1126]" />
                        </div>
                      ))}
                   </div>
                </div>

                {/* Role Specialization Tree */}
                <div className="space-y-8">
                   <div className="flex items-center gap-3 px-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Role Specialization</h3>
                   </div>
                   <div className="grid grid-cols-1 gap-6">
                      {/* We show all roles as separate branches of the tree */}
                      {Object.entries(gameMetrics.roles).map(([roleName, skills]) => (
                        <div key={roleName} className="space-y-4">
                           <Badge variant="outline" className="border-blue-500/20 text-blue-400 text-[8px] uppercase tracking-widest px-3 py-1 mb-2">
                              {roleName} Module
                           </Badge>
                           <div className="grid grid-cols-1 gap-4">
                              {skills.map(skill => (
                                <div key={skill.name} className="bg-blue-500/[0.02] border border-blue-500/10 rounded-2xl p-5 space-y-3 hover:border-blue-500/40 transition-all group">
                                   <div className="flex justify-between items-center">
                                      <h4 className="text-white/80 font-bold uppercase text-[10px] tracking-widest group-hover:text-blue-400 transition-colors">{skill.label}</h4>
                                      <span className="text-sm font-black text-white italic">{(gameStats?.current?.[skill.name] || 0).toFixed(1)}</span>
                                   </div>
                                   <AnimatedProgressBar value={gameStats?.current?.[skill.name] || 0} max={5} color="bg-blue-500" />
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
           </div>

           {/* Growth Chart */}
           <div className="bg-[#0a0a0c] border border-white/10 rounded-[3rem] p-10 shadow-2xl space-y-8 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-blue-500/20 rounded-2xl">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Evolution <span className="text-blue-400">Timeline</span></h2>
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Temporal Performance Analysis</p>
                   </div>
                </div>
                
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 max-w-full overflow-x-auto no-scrollbar">
                  {availableMetrics.map(m => (
                    <button
                      key={m}
                      onClick={() => setActiveMetric(m)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        activeMetric === m ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-white/40 hover:text-white"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[350px] w-full mt-4">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#ffffff20" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#ffffff20" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        domain={[0, 5]}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
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
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/5">
                    <History className="h-12 w-12 text-white/5" />
                    <p className="text-white/20 text-xs font-black uppercase tracking-[0.2em] max-w-xs leading-relaxed">No historical data available for {selectedGame}. Start a review to build your timeline.</p>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: RECENT FEEDBACK & ASSIGNMENTS */}
        <div className="xl:col-span-4 space-y-10">
           <section className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-green-500/10 rounded-xl">
                    <MessageSquare className="h-5 w-5 text-green-400" />
                 </div>
                 <h3 className="text-lg font-black uppercase italic tracking-wider text-white">Session <span className="text-green-400">Directives</span></h3>
              </div>

              <div className="space-y-6">
                 {playerTickets.length === 0 ? (
                   <div className="bg-[#0a0a0c] border border-dashed border-white/10 rounded-[2.5rem] p-12 text-center space-y-4">
                      <Star className="h-10 w-10 text-white/5 mx-auto" />
                      <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed">No completed reviews for {selectedGame}.</p>
                      <Button 
                        onClick={() => navigate("/dashboard/pro-pipeline-submission")}
                        className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white gap-2 shadow-lg shadow-[#CE1126]/20 px-8 h-12 rounded-xl font-black uppercase tracking-widest text-xs mx-auto"
                      >
                        <Video className="h-4 w-4" />
                        Initiate Review
                      </Button>
                   </div>
                 ) : (
                   playerTickets.map(ticket => (
                     <div key={ticket.id} className="bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] p-8 hover:border-green-500/40 transition-all group relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-5"><CheckCircle2 className="h-12 w-12 text-green-500" /></div>
                        
                        <div className="flex justify-between items-start mb-6">
                           <div className="space-y-1">
                              <Badge className="bg-green-500/10 text-green-500 border-none uppercase text-[9px] font-black tracking-widest">{ticket.helpType}</Badge>
                              <h4 className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">{new Date(ticket.createdAt).toLocaleDateString()}</h4>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="bg-white/5 p-5 rounded-2xl border border-white/5 italic text-sm text-white/80 leading-relaxed group-hover:bg-white/[0.08] transition-all">
                              "{ticket.feedback || "Awaiting final debrief..."}"
                           </div>
                           
                           {ticket.metrics && (
                             <div className="grid grid-cols-2 gap-3">
                                {Object.entries(ticket.metrics).slice(0, 4).map(([m, s]) => (
                                  <div key={m} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl">
                                     <span className="text-[8px] font-black text-white/20 uppercase truncate mr-2">{m}</span>
                                     <span className="text-xs font-black text-white italic">{s}</span>
                                  </div>
                                ))}
                             </div>
                           )}

                           <Button variant="link" className="p-0 text-[#CE1126] text-[10px] font-black uppercase tracking-[0.2em] h-auto group-hover:translate-x-1 transition-transform">
                              Access Full Archives <ChevronRight className="h-3 w-3 ml-1" />
                           </Button>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </section>

           <section className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Target className="h-5 w-5 text-blue-400" />
                 </div>
                 <h3 className="text-lg font-black uppercase italic tracking-wider text-white">Active <span className="text-blue-400">Directives</span></h3>
              </div>

              <div className="bg-[#0a0a0c] border border-blue-500/30 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                 <div className="flex justify-between items-start">
                    <Badge className="bg-blue-500/10 text-blue-400 border-none uppercase font-black text-[9px] tracking-widest italic">Priority Focus</Badge>
                    <Zap className="h-5 w-5 text-blue-400 animate-pulse" />
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-white font-black text-xl leading-tight uppercase tracking-tighter italic">Refine {selectedGame} Mechanics</h4>
                    <p className="text-xs text-white/40 leading-relaxed font-medium">
                       Focus on consistency and reaction time. Your coach has noted a 0.5 point drop in your recent session.
                    </p>
                 </div>
                 <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                    Sync Progress
                 </Button>
              </div>
           </section>
        </div>

      </div>
    </div>
  );
}
