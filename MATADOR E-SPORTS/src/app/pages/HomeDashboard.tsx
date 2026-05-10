import { HeroBanner } from "../components/HeroBanner";
import { CommunityFeed } from "../components/CommunityFeed";
import { Link } from "react-router";
import { Trophy, Shield } from "lucide-react";
import { Badge } from "../components/ui/badge";

export function HomeDashboard() {
  return (
    <div className="flex">
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        <HeroBanner />
        
        {/* Quick Links / Entry points to minimize mental stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/path-to-pro" className="group block">
            <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-6 hover:border-[#CE1126]/50 transition-all">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-[#CE1126]/20 rounded-lg group-hover:bg-[#CE1126]/30 transition-all">
                  <Trophy className="h-6 w-6 text-[#CE1126]" />
                </div>
                <div>
                  <h3 className="text-xl text-white">The Pro Pipeline</h3>
                  <p className="text-[#a8b2bf] text-sm">Track your progress to varsity</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">View Tracker &rarr;</span>
                <Badge className="bg-[#CE1126] text-white">50% Complete</Badge>
              </div>
            </div>
          </Link>

          <Link to="/coach-terminal" className="group block">
            <div className="bg-[#0d0d12] border border-white/10 rounded-xl p-6 hover:border-[#CE1126]/50 transition-all">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-all">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white">Scouting & Coach View</h3>
                  <p className="text-[#a8b2bf] text-sm">Active bounties and stats</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">Enter Terminal &rarr;</span>
                <Badge variant="outline" className="border-white/20 text-white/70">Requires Staff</Badge>
              </div>
            </div>
          </Link>
        </div>

        <CommunityFeed />
      </main>
    </div>
  );
}
