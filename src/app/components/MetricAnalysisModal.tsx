import { useState, useMemo, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Video, 
  FileText, 
  BarChart3, 
  Save, 
  ExternalLink, 
  Zap,
  ChevronRight,
  Target,
  Play,
  ClipboardList
} from "lucide-react";
import { StarRating, AnimatedProgressBar } from "./ui/StarRating";
import { GAME_METRICS_MAP, SkillMetric } from "../../lib/gameMetrics";
import { CoachingTicket } from "../hooks/useTickets";
import { toast } from "sonner";

interface MetricAnalysisModalProps {
  ticket: CoachingTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (feedback: string, notes: string, metrics: Record<string, number>) => Promise<void>;
  isSaving: boolean;
}

export function MetricAnalysisModal({ ticket, isOpen, onClose, onSave, isSaving }: MetricAnalysisModalProps) {
  const [activeTab, setActiveTab] = useState<"vod" | "notes" | "rubric">("vod");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [metricScores, setMetricScores] = useState<Record<string, number>>({});

  const gameMetrics = useMemo(() => {
    if (!ticket) return GAME_METRICS_MAP["Default"];
    return GAME_METRICS_MAP[ticket.game] || GAME_METRICS_MAP["Default"];
  }, [ticket]);

  // Reset state when ticket changes
  useEffect(() => {
    if (ticket) {
      setNotes(ticket.notes || "");
      setFeedback(ticket.feedback || "");
      setMetricScores(ticket.metrics || {});
      
      // Try to find a default role if possible
      const availableRoles = Object.keys(gameMetrics.roles);
      if (availableRoles.length > 0 && !selectedRole) {
        setSelectedRole(availableRoles[0]);
      }
    }
  }, [ticket, gameMetrics]);

  if (!ticket) return null;

  const handleScoreChange = (metricName: string, score: number) => {
    setMetricScores(prev => ({ ...prev, [metricName]: score }));
  };

  const calculateAverage = (metrics: SkillMetric[]) => {
    const scores = metrics.map(m => metricScores[m.name] || 0);
    if (scores.length === 0) return 0;
    const sum = scores.reduce((a, b) => a + b, 0);
    return (sum / scores.length);
  };

  const gameSkillsAvg = calculateAverage(gameMetrics.gameSkills);
  const roleSkillsAvg = calculateAverage(gameMetrics.roles[selectedRole] || []);
  const totalAvg = (gameSkillsAvg + roleSkillsAvg) / 2;

  const handleSave = async () => {
    await onSave(feedback, notes, metricScores);
    onClose();
  };

  // Helper to extract YouTube ID or return URL
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(ytRegex);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };

  const embedUrl = getEmbedUrl(ticket.vodLink);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0a0a0c] border-white/10 text-white max-w-[90vw] w-[1200px] h-[85vh] rounded-[3rem] shadow-2xl p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/[0.02] to-transparent">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#CE1126] rounded-2xl shadow-xl shadow-[#CE1126]/20">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge className="bg-[#CE1126]/10 text-[#CE1126] border-none text-[10px] uppercase font-black tracking-widest px-3 py-1">
                  {ticket.game}
                </Badge>
                <span className="text-white/20 font-black italic text-xs uppercase tracking-widest">Analysis Session</span>
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                Reviewing <span className="text-[#CE1126]">{ticket.playerName}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
            {[
              { id: "vod", icon: Video, label: "VOD Review" },
              { id: "notes", icon: FileText, label: "Coach Notes" },
              { id: "rubric", icon: BarChart3, label: "Skill Rubric" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? "bg-[#CE1126] text-white shadow-lg shadow-[#CE1126]/20" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Display */}
          <div className="flex-1 bg-black/40 p-8 overflow-y-auto custom-scrollbar">
            {activeTab === "vod" && (
              <div className="h-full flex flex-col gap-6">
                {embedUrl ? (
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                    <iframe 
                      src={embedUrl}
                      className="w-full h-full"
                      allowFullScreen
                      title="VOD Review"
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10 space-y-4">
                    <Video className="h-16 w-16 text-white/5" />
                    <p className="text-white/40 font-black uppercase tracking-widest text-sm">No VOD Link Provided</p>
                  </div>
                )}
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4">
                   <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[#CE1126]" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Player Objectives</h3>
                   </div>
                   <p className="text-lg text-white/90 italic font-medium leading-relaxed">"{ticket.goals}"</p>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="h-full flex flex-col gap-8">
                <div className="flex-1 flex flex-col space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#CE1126]">Session Observations</h3>
                    <span className="text-[10px] text-white/20 font-bold uppercase">Private Notes for Coach</span>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Document technical flaws, positioning errors, and specific timestamps here..."
                    className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl p-8 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 text-white placeholder-white/10 text-lg leading-relaxed resize-none transition-all"
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Final Feedback for Player</h3>
                    <span className="text-[10px] text-white/20 font-bold uppercase">Visible to Player</span>
                  </div>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Summarize the key takeaways and growth steps for the player..."
                    className="h-[200px] bg-blue-500/[0.02] border border-blue-500/20 rounded-3xl p-8 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-white/10 text-lg leading-relaxed resize-none transition-all"
                  />
                </div>
              </div>
            )}

            {activeTab === "rubric" && (
              <div className="h-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Game Skills Section */}
                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-2xl">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase italic tracking-wider text-white">Core <span className="text-[#CE1126]">Game Skills</span></h3>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Universal Performance Metrics</p>
                      </div>
                    </div>
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                      <span className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-3">Section Avg:</span>
                      <span className="text-xl font-black text-white italic">{gameSkillsAvg.toFixed(1)} <span className="text-xs text-white/20">/ 5</span></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gameMetrics.gameSkills.map(metric => (
                      <div key={metric.name} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-4 hover:bg-white/[0.05] transition-all group">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white font-black uppercase tracking-tight text-sm">{metric.label}</h4>
                            <p className="text-[10px] text-white/40 font-medium leading-tight mt-1">{metric.description}</p>
                          </div>
                          <span className="text-lg font-black text-[#CE1126] italic">{metricScores[metric.name] || 0}</span>
                        </div>
                        <div className="flex flex-col gap-4">
                          <StarRating 
                            value={metricScores[metric.name] || 0} 
                            onChange={(val) => handleScoreChange(metric.name, val)} 
                          />
                          <AnimatedProgressBar value={metricScores[metric.name] || 0} max={5} color="bg-[#CE1126]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Role Skills Section */}
                <section className="space-y-8 pb-12">
                   <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-2xl">
                        <Zap className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase italic tracking-wider text-white">Specialized <span className="text-blue-400">Role Skills</span></h3>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Position-Specific Calibration</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        {Object.keys(gameMetrics.roles).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <div className="bg-blue-500/10 px-6 py-3 rounded-2xl border border-blue-500/20">
                        <span className="text-[10px] text-blue-400/60 font-black uppercase tracking-widest mr-3">Role Avg:</span>
                        <span className="text-xl font-black text-blue-400 italic">{roleSkillsAvg.toFixed(1)} <span className="text-xs text-blue-400/20">/ 5</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(gameMetrics.roles[selectedRole] || []).map(metric => (
                      <div key={metric.name} className="bg-blue-500/[0.03] border border-blue-500/10 rounded-3xl p-6 space-y-4 hover:bg-blue-500/[0.05] transition-all group">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white font-black uppercase tracking-tight text-sm">{metric.label}</h4>
                            <p className="text-[10px] text-white/40 font-medium leading-tight mt-1">{metric.description}</p>
                          </div>
                          <span className="text-lg font-black text-blue-400 italic">{metricScores[metric.name] || 0}</span>
                        </div>
                        <div className="flex flex-col gap-4">
                          <StarRating 
                            value={metricScores[metric.name] || 0} 
                            onChange={(val) => handleScoreChange(metric.name, val)} 
                          />
                          <AnimatedProgressBar value={metricScores[metric.name] || 0} max={5} color="bg-blue-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="w-[350px] border-l border-white/5 p-8 space-y-10 bg-white/[0.01]">
             <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Performance Pulse</h4>
                <div className="space-y-8">
                   <div className="text-center p-8 bg-gradient-to-br from-[#CE1126]/20 to-transparent border border-[#CE1126]/20 rounded-[2rem] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="h-12 w-12" /></div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-[#CE1126] mb-2">Overall Score</span>
                      <span className="text-6xl font-black text-white italic tracking-tighter">{(totalAvg * 20).toFixed(0)}<span className="text-2xl text-white/20">/100</span></span>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Technical Proficiency</span>
                        <span className="text-sm font-black text-white italic">{(gameSkillsAvg * 20).toFixed(0)}%</span>
                      </div>
                      <AnimatedProgressBar value={gameSkillsAvg} max={5} color="bg-[#CE1126]" />
                      
                      <div className="flex justify-between items-end pt-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Strategic Context</span>
                        <span className="text-sm font-black text-white italic">{(roleSkillsAvg * 20).toFixed(0)}%</span>
                      </div>
                      <AnimatedProgressBar value={roleSkillsAvg} max={5} color="bg-blue-500" />
                   </div>
                </div>
             </div>

             <div className="space-y-4 pt-10 border-t border-white/5">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <ClipboardList className="h-5 w-5 text-[#CE1126]" />
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">Status</p>
                      <p className="text-[10px] font-black text-white uppercase italic">{ticket.status}</p>
                   </div>
                </div>
                
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 text-white h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-[#CE1126]/20 group"
                >
                  {isSaving ? "Uploading..." : (
                    <>
                      <Save className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" /> 
                      Commit Analysis
                    </>
                  )}
                </Button>
                
                <p className="text-[9px] text-white/20 text-center font-bold uppercase tracking-widest">
                  Analysis will be permanently linked to this ticket and visible to the player.
                </p>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
