import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { Target, Plus, Zap, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

type Priority = "High" | "Medium" | "Low";

interface Bounty {
  id: string;
  game: string;
  role: string;
  rank: string;
  priority: Priority;
}

interface Applicant {
  id: string;
  name: string;
  game: string;
  rank: string;
  profileLink: string;
  status: "Pending" | "Accepted" | "Declined";
}

const priorityColors: Record<Priority, string> = {
  High: "bg-[#CE1126]/20 text-[#CE1126]",
  Medium: "bg-yellow-500/20 text-yellow-400",
  Low: "bg-white/10 text-[#a8b2bf]",
};

const games = ["Valorant", "League of Legends", "Rocket League", "CS2", "Overwatch 2"];
const priorities: Priority[] = ["High", "Medium", "Low"];

const initialBounties: Bounty[] = [
  { id: "b1", game: "Valorant", role: "Sentinel", rank: "Ascendant+", priority: "High" },
  { id: "b2", game: "League of Legends", role: "Jungle Main", rank: "Platinum+", priority: "Medium" },
  { id: "b3", game: "Rocket League", role: "Any Position", rank: "Champion+", priority: "High" },
];

const initialApplicants: Applicant[] = [
  { id: "a1", name: "ProSentinel99", game: "Valorant", rank: "Immortal 2", profileLink: "tracker.gg/valorant/prosentinel99", status: "Pending" },
  { id: "a2", name: "JungleKing", game: "League of Legends", rank: "Platinum 1", profileLink: "op.gg/jungleking", status: "Pending" },
  { id: "a3", name: "RocketAce", game: "Rocket League", rank: "Grand Champ", profileLink: "rocketleague.tracker.gg/rocketace", status: "Accepted" },
];

const emptyBountyForm = { game: games[0], role: "", rank: "", priority: "Medium" as Priority };

// Multi-step apply dialog (step 1: game, step 2: profile + rank, step 3: confirm)
const applySteps = ["Select Game", "Your Profile", "Confirm"];

export function ScoutingBoard() {
  const [bounties, setBounties] = useState<Bounty[]>(initialBounties);
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [addBountyOpen, setAddBountyOpen] = useState(false);
  const [deleteBountyId, setDeleteBountyId] = useState<string | null>(null);
  const [bountyForm, setBountyForm] = useState(emptyBountyForm);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyStep, setApplyStep] = useState(0);
  const [applyData, setApplyData] = useState({ game: games[0], profile: "", rank: "" });

  function addBounty() {
    if (!bountyForm.role || !bountyForm.rank) return;
    setBounties((prev) => [
      ...prev,
      { id: `b${Date.now()}`, ...bountyForm },
    ]);
    setBountyForm(emptyBountyForm);
    setAddBountyOpen(false);
  }

  function removeBounty(id: string) {
    setBounties((prev) => prev.filter((b) => b.id !== id));
    setDeleteBountyId(null);
  }

  function updateApplicantStatus(id: string, status: Applicant["status"]) {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  function submitApplication() {
    // TODO: replace with API
    const newApplicant: Applicant = {
      id: `a${Date.now()}`,
      name: "MatadorX",
      game: applyData.game,
      rank: applyData.rank,
      profileLink: applyData.profile,
      status: "Pending",
    };
    setApplicants((prev) => [newApplicant, ...prev]);
    setApplyOpen(false);
    setApplyStep(0);
    setApplyData({ game: games[0], profile: "", rank: "" });
  }

  const pendingCount = applicants.filter((a) => a.status === "Pending").length;

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-full">
      <PageHeader
        title="Scouting Board"
        backTo="/dashboard/coach-terminal"
        backLabel="Coach's Terminal"
        action={
          <Button
            id="apply-tryout-btn"
            className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white flex items-center gap-2"
            onClick={() => { setApplyOpen(true); setApplyStep(0); }}
          >
            <Plus className="h-4 w-4" />
            Apply for Tryout
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Bounties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#CE1126]" />
              <h2 className="text-white font-semibold">Active Bounties</h2>
              <Badge className="bg-[#CE1126]/20 text-[#CE1126] text-xs">{bounties.length}</Badge>
            </div>
            <Button
              id="add-bounty-btn"
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white text-xs"
              onClick={() => setAddBountyOpen(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              New Bounty
            </Button>
          </div>

          {bounties.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No active bounties"
              description="Create a bounty to start recruiting for a specific role."
            />
          ) : (
            <div className="space-y-3">
              {bounties.map((bounty) => (
                <div
                  key={bounty.id}
                  className="bg-[#0d0d12] border border-white/10 rounded-xl p-4 hover:border-[#CE1126]/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium text-sm">{bounty.game}</p>
                      <p className="text-[#a8b2bf] text-xs mt-0.5">{bounty.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${priorityColors[bounty.priority]}`}>
                        {bounty.priority}
                      </Badge>
                      <button
                        id={`delete-bounty-${bounty.id}`}
                        onClick={() => setDeleteBountyId(bounty.id)}
                        className="p-1 rounded text-[#a8b2bf] hover:text-red-400 hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove bounty"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#a8b2bf]">
                    <Zap className="h-3.5 w-3.5 text-[#CE1126]" />
                    <span>Min. Rank: {bounty.rank}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Applicants */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-white font-semibold">Applicants</h2>
            {pendingCount > 0 && (
              <Badge className="bg-[#CE1126]/20 text-[#CE1126] text-xs">
                {pendingCount} pending
              </Badge>
            )}
          </div>

          {applicants.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No applicants yet"
              description="Applicants will appear here after they apply for a tryout."
            />
          ) : (
            <div className="space-y-3">
              {applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className={`bg-[#0d0d12] border rounded-xl p-4 transition-all ${applicant.status === "Accepted"
                      ? "border-green-600/30"
                      : applicant.status === "Declined"
                        ? "border-red-900/30 opacity-60"
                        : "border-white/10 hover:border-[#CE1126]/30"
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium text-sm">{applicant.name}</p>
                      <p className="text-[#a8b2bf] text-xs">
                        {applicant.game} · {applicant.rank}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${applicant.status === "Accepted"
                          ? "bg-green-500/20 text-green-400"
                          : applicant.status === "Declined"
                            ? "bg-red-900/20 text-red-400"
                            : "bg-white/10 text-[#a8b2bf]"
                        }`}
                    >
                      {applicant.status}
                    </Badge>
                  </div>

                  <p className="text-[#a8b2bf] text-xs mb-3 truncate">{applicant.profileLink}</p>

                  {applicant.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        id={`accept-${applicant.id}`}
                        onClick={() => updateApplicantStatus(applicant.id, "Accepted")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30 text-xs font-medium transition-all"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Accept
                      </button>
                      <button
                        id={`decline-${applicant.id}`}
                        onClick={() => updateApplicantStatus(applicant.id, "Declined")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-900/20 text-red-400 border border-red-900/30 hover:bg-red-900/30 text-xs font-medium transition-all"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Bounty Dialog */}
      <Dialog open={addBountyOpen} onOpenChange={setAddBountyOpen}>
        <DialogContent className="bg-[#0d0d12] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">New Recruitment Bounty</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="bounty-game" className="block text-sm text-[#a8b2bf] mb-1.5">Game</label>
              <select id="bounty-game" value={bountyForm.game}
                onChange={(e) => setBountyForm((f) => ({ ...f, game: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CE1126]/50">
                {games.map((g) => <option key={g} value={g} className="bg-[#0d0d12]">{g}</option>)}
              </select>
            </div>
            {[
              { id: "bounty-role", label: "Role Needed", key: "role", placeholder: "e.g. Sentinel, Jungle Main" },
              { id: "bounty-rank", label: "Minimum Rank", key: "rank", placeholder: "e.g. Ascendant+" },
            ].map(({ id, label, key, placeholder }) => (
              <div key={key}>
                <label htmlFor={id} className="block text-sm text-[#a8b2bf] mb-1.5">{label}</label>
                <input id={id} type="text" placeholder={placeholder}
                  value={bountyForm[key as keyof typeof bountyForm]}
                  onChange={(e) => setBountyForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CE1126]/50"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm text-[#a8b2bf] mb-1.5">Priority</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button key={p} onClick={() => setBountyForm((f) => ({ ...f, priority: p }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${bountyForm.priority === p
                        ? p === "High" ? "bg-[#CE1126]/20 text-[#CE1126] border-[#CE1126]/40"
                          : p === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                            : "bg-white/10 text-[#a8b2bf] border-white/20"
                        : "bg-white/5 text-[#a8b2bf] border-white/10 hover:bg-white/10"
                      }`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
              onClick={() => setAddBountyOpen(false)}>Cancel</Button>
            <Button id="submit-bounty-btn" className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
              onClick={addBounty} disabled={!bountyForm.role || !bountyForm.rank}>
              Create Bounty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multi-step Apply Dialog */}
      <Dialog open={applyOpen} onOpenChange={(open) => { setApplyOpen(open); if (!open) setApplyStep(0); }}>
        <DialogContent className="bg-[#0d0d12] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Apply for Tryout</DialogTitle>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-2 py-1">
            {applySteps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < applyStep ? "bg-green-500 text-white"
                    : i === applyStep ? "bg-[#CE1126] text-white"
                      : "bg-white/10 text-[#a8b2bf]"
                  }`}>
                  {i < applyStep ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${i === applyStep ? "text-white" : "text-[#a8b2bf]"}`}>{step}</span>
                {i < applySteps.length - 1 && <div className="h-px w-6 bg-white/10" />}
              </div>
            ))}
          </div>

          <div className="py-2 min-h-[120px]">
            {applyStep === 0 && (
              <div>
                <label htmlFor="apply-game" className="block text-sm text-[#a8b2bf] mb-1.5">Which game are you applying for?</label>
                <select id="apply-game" value={applyData.game}
                  onChange={(e) => setApplyData((d) => ({ ...d, game: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CE1126]/50">
                  {games.map((g) => <option key={g} value={g} className="bg-[#0d0d12]">{g}</option>)}
                </select>
              </div>
            )}
            {applyStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="apply-profile" className="block text-sm text-[#a8b2bf] mb-1.5">Profile Link (Tracker.gg, OP.GG, etc.)</label>
                  <input id="apply-profile" type="text" placeholder="https://tracker.gg/..."
                    value={applyData.profile}
                    onChange={(e) => setApplyData((d) => ({ ...d, profile: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CE1126]/50"
                  />
                </div>
                <div>
                  <label htmlFor="apply-rank" className="block text-sm text-[#a8b2bf] mb-1.5">Current Rank</label>
                  <input id="apply-rank" type="text" placeholder="e.g. Ascendant 2"
                    value={applyData.rank}
                    onChange={(e) => setApplyData((d) => ({ ...d, rank: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CE1126]/50"
                  />
                </div>
              </div>
            )}
            {applyStep === 2 && (
              <div className="bg-white/5 rounded-lg p-4 space-y-3">
                <p className="text-white font-medium text-sm">Confirm your application</p>
                {[
                  { label: "Game", value: applyData.game },
                  { label: "Profile", value: applyData.profile },
                  { label: "Rank", value: applyData.rank },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[#a8b2bf]">{label}</span>
                    <span className="text-white truncate max-w-[200px]">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {applyStep > 0 && (
              <Button variant="outline" className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
                onClick={() => setApplyStep((s) => s - 1)}>Back</Button>
            )}
            <Button variant="outline" className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
              onClick={() => { setApplyOpen(false); setApplyStep(0); }}>Cancel</Button>
            {applyStep < applySteps.length - 1 ? (
              <Button id={`apply-next-step-${applyStep}`} className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
                onClick={() => setApplyStep((s) => s + 1)}
                disabled={applyStep === 1 && (!applyData.profile || !applyData.rank)}>
                Next →
              </Button>
            ) : (
              <Button id="submit-application-btn" className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
                onClick={submitApplication}>
                Submit Application
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Bounty Confirm */}
      <ConfirmDialog
        open={deleteBountyId !== null}
        onOpenChange={(open) => !open && setDeleteBountyId(null)}
        title="Remove Bounty"
        description="Remove this recruitment bounty? Players will no longer be able to apply for this role."
        confirmLabel="Remove"
        danger
        onConfirm={() => deleteBountyId && removeBounty(deleteBountyId)}
      />
    </div>
  );
}
