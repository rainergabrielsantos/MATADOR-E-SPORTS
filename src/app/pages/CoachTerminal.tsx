import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../components/PageHeader";
import { CoachingKanban } from "../components/CoachingKanban";
import {
  Users,
  Target,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

export function CoachTerminal() {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-full space-y-8">
      <PageHeader
        title="Coach's Terminal"
        subtitle="Player development, scouting, and roster management."
        backTo="/dashboard"
        backLabel="Home"
      />

      {/* Staff Tool Cards — navigate to sub-pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/dashboard/coach-terminal/roster"
          id="nav-roster"
          className="group bg-[#0d0d12] border border-white/10 rounded-xl p-6 hover:border-[#CE1126]/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#CE1126]/20 rounded-lg group-hover:bg-[#CE1126]/30 transition-all">
              <Users className="h-5 w-5 text-[#CE1126]" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Roster Manager</h3>
              <p className="text-[#a8b2bf] text-sm">Add, remove, and update player status</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#a8b2bf] group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/dashboard/coach-terminal/scouting"
          id="nav-scouting"
          className="group bg-[#0d0d12] border border-white/10 rounded-xl p-6 hover:border-[#CE1126]/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-all">
              <Target className="h-5 w-5 text-[#a8b2bf] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Scouting Board</h3>
              <p className="text-[#a8b2bf] text-sm">Manage bounties and review applicants</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#a8b2bf] group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Coaching Queue Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-[#CE1126]" />
          <h2 className="text-xl text-white font-bold uppercase italic">Coaching <span className="text-[#CE1126]">Queue</span></h2>
        </div>
        <CoachingKanban />
      </div>
    </div>
  );
}
