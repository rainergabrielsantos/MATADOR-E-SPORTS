import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { Users, Plus, Trash2, ChevronDown } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

type PlayerStatus = "Active" | "Trial" | "Inactive";

interface Player {
  id: string;
  name: string;
  csunId: string;
  game: string;
  role: string;
  rank: string;
  status: PlayerStatus;
}

const statusCycle: Record<PlayerStatus, PlayerStatus> = {
  Active: "Trial",
  Trial: "Inactive",
  Inactive: "Active",
};

const statusColors: Record<PlayerStatus, string> = {
  Active: "bg-green-500/20 text-green-400",
  Trial: "bg-yellow-500/20 text-yellow-400",
  Inactive: "bg-white/10 text-[#a8b2bf]",
};

const games = ["Valorant", "League of Legends", "Rocket League", "CS2", "Overwatch 2"];

const initialPlayers: Player[] = [
  { id: "p1", name: "MatadorX", csunId: "012345678", game: "Valorant", role: "IGL / Controller", rank: "Diamond 3", status: "Active" },
  { id: "p2", name: "RedMatador", csunId: "023456789", game: "Valorant", role: "Sentinel", rank: "Ascendant 1", status: "Active" },
  { id: "p3", name: "MatadorGG", csunId: "034567890", game: "League of Legends", role: "Jungle", rank: "Platinum 2", status: "Trial" },
  { id: "p4", name: "SilverMat", csunId: "045678901", game: "CS2", role: "Entry", rank: "MG2", status: "Trial" },
];

const emptyAddForm = { name: "", csunId: "", game: games[0], role: "", rank: "" };

export function RosterManager() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addForm, setAddForm] = useState(emptyAddForm);
  const [filterGame, setFilterGame] = useState("All");

  const allGames = ["All", ...games];

  const filtered = players.filter(
    (p) => filterGame === "All" || p.game === filterGame
  );

  function cycleStatus(id: string) {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: statusCycle[p.status] } : p
      )
    );
  }

  function addPlayer() {
    if (!addForm.name || !addForm.csunId || !addForm.role || !addForm.rank) return;
    const newPlayer: Player = {
      id: `p${Date.now()}`,
      ...addForm,
      status: "Trial",
    };
    setPlayers((prev) => [...prev, newPlayer]);
    setAddForm(emptyAddForm);
    setAddDialogOpen(false);
  }

  function removePlayer(id: string) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-full">
      <PageHeader
        title="Roster Manager"
        backTo="/dashboard/coach-terminal"
        backLabel="Coach's Terminal"
        action={
          <Button
            id="add-player-btn"
            className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white flex items-center gap-2"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Player
          </Button>
        }
      />

      {/* Game Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {allGames.map((game) => (
          <button
            key={game}
            id={`roster-filter-${game.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => setFilterGame(game)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterGame === game
                ? "bg-[#CE1126] text-white"
                : "bg-white/5 border border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
            }`}
          >
            {game}
          </button>
        ))}
      </div>

      {/* Player Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No players on roster"
          description="Add your first player to get started."
          action={
            <Button
              className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          }
        />
      ) : (
        <div className="bg-[#0d0d12] border border-white/10 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-xs text-[#a8b2bf] uppercase tracking-wider">
            <span>Player</span>
            <span>Game / Role</span>
            <span>Rank</span>
            <span>Status</span>
            <span />
          </div>

          {/* Rows */}
          {filtered.map((player) => (
            <div
              key={player.id}
              className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-4 items-center border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
            >
              {/* Player info */}
              <div>
                <p className="text-white font-medium text-sm">{player.name}</p>
                <p className="text-[#a8b2bf] text-xs">{player.csunId}</p>
              </div>

              {/* Game / role */}
              <div>
                <p className="text-white text-sm">{player.game}</p>
                <p className="text-[#a8b2bf] text-xs">{player.role}</p>
              </div>

              {/* Rank */}
              <p className="text-[#a8b2bf] text-sm">{player.rank}</p>

              {/* Status — clickable cycle */}
              <button
                id={`status-cycle-${player.id}`}
                onClick={() => cycleStatus(player.id)}
                title="Click to cycle status"
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all hover:opacity-80 ${statusColors[player.status]}`}
              >
                {player.status}
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* Delete */}
              <button
                id={`delete-player-${player.id}`}
                onClick={() => setDeleteId(player.id)}
                className="p-1.5 rounded-lg text-[#a8b2bf] hover:text-red-400 hover:bg-red-900/20 transition-all"
                title="Remove player"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Player Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-[#0d0d12] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Add Player</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {[
              { id: "add-name", label: "Player Name / Username", key: "name", placeholder: "e.g. MatadorX" },
              { id: "add-csunid", label: "CSUN ID", key: "csunId", placeholder: "e.g. 012345678" },
              { id: "add-role", label: "Role / Position", key: "role", placeholder: "e.g. IGL, Sentinel, Jungle" },
              { id: "add-rank", label: "Current Rank", key: "rank", placeholder: "e.g. Diamond 3" },
            ].map(({ id, label, key, placeholder }) => (
              <div key={key}>
                <label htmlFor={id} className="block text-sm text-[#a8b2bf] mb-1.5">
                  {label}
                </label>
                <input
                  id={id}
                  type="text"
                  placeholder={placeholder}
                  value={addForm[key as keyof typeof addForm]}
                  onChange={(e) => setAddForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CE1126]/50 transition-colors"
                />
              </div>
            ))}

            <div>
              <label htmlFor="add-game" className="block text-sm text-[#a8b2bf] mb-1.5">
                Primary Game
              </label>
              <select
                id="add-game"
                value={addForm.game}
                onChange={(e) => setAddForm((f) => ({ ...f, game: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CE1126]/50 transition-colors"
              >
                {games.map((g) => (
                  <option key={g} value={g} className="bg-[#0d0d12]">
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
              onClick={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="submit-add-player-btn"
              className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
              onClick={addPlayer}
              disabled={!addForm.name || !addForm.csunId || !addForm.role || !addForm.rank}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to Roster
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove Player"
        description={`Remove ${players.find((p) => p.id === deleteId)?.name ?? "this player"} from the roster? This cannot be undone.`}
        confirmLabel="Remove"
        danger
        onConfirm={() => deleteId && removePlayer(deleteId)}
      />
    </div>
  );
}
