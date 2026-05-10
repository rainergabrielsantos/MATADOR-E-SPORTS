import { ScoutingPanel } from "../components/ScoutingPanel";
import { PlayerDevelopmentCard } from "../components/PlayerDevelopmentCard";

export function CoachTerminal() {
  return (
    <div className="p-8 max-w-6xl mx-auto min-h-full flex gap-8">
      {/* Main Stats / Player Development */}
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-4xl text-white font-bold mb-2">Coach's Terminal</h1>
          <p className="text-[#a8b2bf] text-lg">Scouting, recruitment, and player development tools.</p>
        </div>
        
        <PlayerDevelopmentCard />
      </div>

      {/* Right Sidebar - Scouting */}
      <aside className="w-[400px]">
        <ScoutingPanel />
      </aside>
    </div>
  );
}
