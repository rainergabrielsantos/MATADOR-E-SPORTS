import { PathToProTracker } from "../components/PathToProTracker";

export function PathToPro() {
  return (
    <div className="p-8 max-w-4xl mx-auto min-h-full">
      <div className="mb-8">
        <h1 className="text-4xl text-white font-bold mb-2">The Pro Pipeline</h1>
        <p className="text-[#a8b2bf] text-lg">Detailed progress tracker for your esports journey.</p>
      </div>
      
      <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
        <PathToProTracker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl text-white mb-4">Current Objective</h2>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-[#CE1126] font-semibold mb-2">Enter Open Scrims</h3>
            <p className="text-[#a8b2bf] text-sm mb-4">
              Participate in at least 3 officially sanctioned open scrimmages to prove your teamwork and communication skills.
            </p>
            <button className="w-full py-2 bg-[#CE1126] hover:bg-[#CE1126]/90 text-white rounded-lg transition-colors">
              Find Scrims
            </button>
          </div>
        </div>

        <div className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl text-white mb-4">Completed Milestones</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-white">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Joined a Club (CSUN Valorant)</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Logged Ranked Stats (Diamond 3)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
