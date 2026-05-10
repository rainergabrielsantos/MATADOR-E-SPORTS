import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../components/PageHeader";
import { PlayerDevelopmentCard } from "../components/PlayerDevelopmentCard";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
  Users,
  Target,
  Upload,
  FileVideo,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

export function CoachTerminal() {
  const [vodDialogOpen, setVodDialogOpen] = useState(false);
  const [vodTitle, setVodTitle] = useState("");
  const [vodFile, setVodFile] = useState<File | null>(null);
  const [vodUploaded, setVodUploaded] = useState(false);
  const [reportSheetOpen, setReportSheetOpen] = useState(false);

  function handleVodUpload() {
    // TODO: replace with API upload
    console.log("Uploading VOD:", vodTitle, vodFile?.name);
    setVodUploaded(true);
    setTimeout(() => {
      setVodDialogOpen(false);
      setVodUploaded(false);
      setVodTitle("");
      setVodFile(null);
    }, 1200);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-full">
      <PageHeader
        title="Coach's Terminal"
        subtitle="Player development, scouting, and roster management."
        backTo="/dashboard"
        backLabel="Home"
      />

      {/* Staff Tool Cards — navigate to sub-pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

      {/* Player Development Card — full report sheet wired */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Player Development Profile</h2>
          <Button
            id="full-report-btn"
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            onClick={() => setReportSheetOpen(true)}
          >
            Full Report →
          </Button>
        </div>
        <PlayerDevelopmentCard
          onUploadVod={() => setVodDialogOpen(true)}
        />
      </div>

      {/* VOD Upload Dialog */}
      <Dialog open={vodDialogOpen} onOpenChange={setVodDialogOpen}>
        <DialogContent className="bg-[#0d0d12] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <FileVideo className="h-5 w-5 text-[#CE1126]" />
              Upload VOD
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="vod-title" className="block text-sm text-[#a8b2bf] mb-1.5">
                VOD Title
              </label>
              <input
                id="vod-title"
                type="text"
                placeholder="e.g. Week 13 Scrimmage vs UCI"
                value={vodTitle}
                onChange={(e) => setVodTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CE1126]/50 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="vod-file" className="block text-sm text-[#a8b2bf] mb-1.5">
                Video File
              </label>
              <div
                className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-[#CE1126]/40 transition-colors cursor-pointer"
                onClick={() => document.getElementById("vod-file-input")?.click()}
              >
                <Upload className="h-6 w-6 text-[#a8b2bf] mx-auto mb-2" />
                {vodFile ? (
                  <p className="text-white text-sm">{vodFile.name}</p>
                ) : (
                  <>
                    <p className="text-[#a8b2bf] text-sm">Click to select a video file</p>
                    <p className="text-white/30 text-xs mt-1">MP4, MOV, AVI supported</p>
                  </>
                )}
                <input
                  id="vod-file-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setVodFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-[#a8b2bf] hover:bg-white/10 hover:text-white"
              onClick={() => setVodDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="submit-vod-btn"
              className={`text-white transition-all ${
                vodUploaded
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-[#CE1126] hover:bg-[#CE1126]/90"
              }`}
              onClick={handleVodUpload}
              disabled={!vodTitle.trim() || !vodFile || vodUploaded}
            >
              {vodUploaded ? "✓ Uploaded!" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Report Sheet (simplified modal) */}
      <Dialog open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <DialogContent className="bg-[#0d0d12] border border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Full Player Report — MatadorX</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            {[
              { label: "Player", value: "MatadorX (CSUN ID: 012345678)" },
              { label: "Primary Game", value: "Valorant" },
              { label: "Current Rank", value: "Diamond 3" },
              { label: "Win Rate", value: "58.3% (last 30 days)" },
              { label: "KD Ratio", value: "1.87" },
              { label: "Hours Logged", value: "247 hrs (this season)" },
              { label: "Attendance", value: "95% — 19/20 practices attended" },
              { label: "Overall Rating", value: "84.2 / 100" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-[#a8b2bf] text-sm">{label}</span>
                <span className="text-white text-sm font-medium">{value}</span>
              </div>
            ))}
            <div className="pt-2">
              <p className="text-[#a8b2bf] text-sm mb-1">Coach Assessment</p>
              <div className="bg-white/5 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Badge className="bg-green-500/20 text-green-400 text-xs flex-shrink-0">Strength</Badge>
                  <p className="text-[#a8b2bf] text-xs">Excellent team communication. Natural IGL tendencies under pressure.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs flex-shrink-0">Focus</Badge>
                  <p className="text-[#a8b2bf] text-xs">Crosshair placement and pre-aiming need work. VOD review recommended.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-[#CE1126]/20 text-[#CE1126] text-xs flex-shrink-0">Next Step</Badge>
                  <p className="text-[#a8b2bf] text-xs">Consider for varsity sub-roster after 2 more scrim performances.</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white"
              onClick={() => setReportSheetOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
