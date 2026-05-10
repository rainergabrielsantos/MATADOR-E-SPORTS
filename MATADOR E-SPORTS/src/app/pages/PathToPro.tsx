import { useState } from "react";
import { Link } from "react-router";
import { PathToProTracker } from "../components/PathToProTracker";
import { PageHeader } from "../components/PageHeader";
import { Swords, ChevronDown, ChevronUp, Clock, BookOpen, Star } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface Milestone {
  id: string;
  label: string;
  completed: boolean;
  locked: boolean;
  current?: boolean;
  description: string;
  unlocks: string;
  tips: string[];
  ctaLabel?: string;
  ctaTo?: string;
}

const milestones: Milestone[] = [
  {
    id: "m1",
    label: "Join a Club",
    completed: true,
    locked: false,
    description: "Officially join a CSUN E-Sports club roster. This gets you into practice schedules and team comms.",
    unlocks: "Access to club Discord and practice schedule",
    tips: ["Attend the first club meeting of the semester", "Introduce yourself in the Discord welcome channel"],
  },
  {
    id: "m2",
    label: "Log Ranked Stats",
    completed: true,
    locked: false,
    description: "Submit your in-game profile link so coaches can verify your current ranked standing.",
    unlocks: "Profile visible to coaching staff",
    tips: ["Use your main account, not a smurf", "All major platforms accepted: Tracker.gg, OP.GG, etc."],
  },
  {
    id: "m3",
    label: "Enter Open Scrims",
    completed: false,
    locked: false,
    current: true,
    description: "Participate in at least 3 officially sanctioned open scrimmages. Coaches evaluate you during these.",
    unlocks: "Eligibility for varsity tryouts",
    tips: [
      "Check the Events page for open scrim blocks",
      "Communicate clearly — shotcalling is noticed",
      "Show up consistently, not just once",
    ],
    ctaLabel: "Find Open Scrims",
    ctaTo: "/dashboard/events?tab=scrims",
  },
  {
    id: "m4",
    label: "Varsity Tryouts",
    completed: false,
    locked: true,
    description: "Invited players compete in a structured tryout evaluated by the head coach and team captains.",
    unlocks: "Varsity roster placement",
    tips: ["Invitations sent by coaching staff after scrim review"],
  },
];

const recentActivity = [
  { time: "3 days ago", action: "Logged Valorant stats — Diamond 3" },
  { time: "1 week ago", action: "Joined CSUN Valorant club roster" },
  { time: "2 weeks ago", action: "Profile created" },
];

export function PathToPro() {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>("m3");

  function toggleMilestone(id: string) {
    setExpandedMilestone((prev) => (prev === id ? null : id));
  }

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-full">
      <PageHeader
        title="The Pro Pipeline"
        subtitle="Your structured roadmap to CSUN varsity E-Sports."
        backTo="/dashboard"
        backLabel="Home"
      />

      {/* Tracker */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
        <PathToProTracker />
      </div>

      {/* Milestone Accordion */}
      <div className="mb-8">
        <h2 className="text-xl text-white font-semibold mb-4">Milestones</h2>
        <div className="space-y-3">
          {milestones.map((m) => {
            const isOpen = expandedMilestone === m.id;
            const canExpand = !m.locked;

            return (
              <div
                key={m.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  m.current
                    ? "border-[#CE1126]/50 bg-[#CE1126]/5"
                    : m.completed
                    ? "border-green-600/30 bg-green-900/5"
                    : "border-white/10 bg-[#0d0d12]"
                }`}
              >
                {/* Header row */}
                <button
                  id={`milestone-${m.id}`}
                  className="w-full flex items-center gap-4 p-4 text-left"
                  onClick={() => canExpand && toggleMilestone(m.id)}
                  disabled={!canExpand}
                >
                  {/* Status dot */}
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      m.completed
                        ? "bg-green-500"
                        : m.current
                        ? "bg-[#CE1126] animate-pulse"
                        : "bg-white/20"
                    }`}
                  />
                  <span
                    className={`flex-1 font-medium ${
                      m.completed
                        ? "text-green-400"
                        : m.current
                        ? "text-white"
                        : "text-[#a8b2bf]"
                    }`}
                  >
                    {m.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {m.completed && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">Complete</Badge>
                    )}
                    {m.current && (
                      <Badge className="bg-[#CE1126]/20 text-[#CE1126] text-xs">In Progress</Badge>
                    )}
                    {m.locked && (
                      <Badge variant="outline" className="border-white/20 text-white/40 text-xs">
                        Locked
                      </Badge>
                    )}
                    {canExpand &&
                      (isOpen ? (
                        <ChevronUp className="h-4 w-4 text-[#a8b2bf]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#a8b2bf]" />
                      ))}
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && canExpand && (
                  <div className="px-5 pb-5 border-t border-white/5">
                    <p className="text-[#a8b2bf] text-sm mt-4 mb-4 leading-relaxed">
                      {m.description}
                    </p>

                    {/* Unlocks */}
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Star className="h-4 w-4 text-[#CE1126] flex-shrink-0" />
                      <span className="text-white/60 text-xs">Unlocks:</span>
                      <span className="text-white text-xs">{m.unlocks}</span>
                    </div>

                    {/* Tips */}
                    <div className="bg-white/5 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <BookOpen className="h-3.5 w-3.5 text-[#CE1126]" />
                        <span className="text-white text-xs font-medium">Tips</span>
                      </div>
                      <ul className="space-y-1">
                        {m.tips.map((tip, i) => (
                          <li key={i} className="text-[#a8b2bf] text-xs flex items-start gap-2">
                            <span className="text-[#CE1126] mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    {m.ctaTo && m.ctaLabel && !m.completed && (
                      <Link
                        to={m.ctaTo}
                        id={`milestone-cta-${m.id}`}
                        className="inline-flex items-center gap-2 bg-[#CE1126] hover:bg-[#CE1126]/90 text-white text-sm px-4 py-2 rounded-lg transition-all"
                      >
                        <Swords className="h-4 w-4" />
                        {m.ctaLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-[#CE1126]" />
          <h2 className="text-white font-semibold">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#CE1126] flex-shrink-0" />
              <span className="text-white text-sm flex-1">{item.action}</span>
              <span className="text-[#a8b2bf] text-xs">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
