import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { Save, User as UserIcon, Image as ImageIcon, Gamepad2, Swords, Shield, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "../components/ui/select";
import { PageHeader } from "../components/PageHeader";

const POPULAR_GAMES = [
  "Valorant",
  "League of Legends",
  "Counter-Strike 2",
  "Overwatch 2",
  "Apex Legends",
  "Rocket League",
  "Super Smash Bros.",
];

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [games, setGames] = useState(user?.games || "");
  const [mainRole, setMainRole] = useState(user?.mainRole || "");

  // Read-only fields
  const username = user?.username || "";
  const role = user?.role || "Member";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ avatar, games, mainRole });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayRole = role === "Player" ? "Varsity Player" : role === "Coach" ? "Staff / Coach" : "Community Member";

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <PageHeader
        title="Edit Profile"
        subtitle="Manage your personal information, gaming preferences, and identity."
        backTo="/dashboard"
        backLabel="Dashboard"
      />

      <div className="bg-[#131318] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#CE1126]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4 md:w-1/3">
            <div className="relative group">
              <Avatar className="h-32 w-32 ring-4 ring-[#CE1126] shadow-xl shadow-[#CE1126]/30 transition-transform duration-500 group-hover:scale-105">
                <AvatarImage src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'Matador'}`} />
                <AvatarFallback className="text-4xl bg-[#CE1126] text-white">{username?.[0] || 'M'}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white uppercase italic tracking-wider">{username}</h3>
              <p className="text-sm text-[#CE1126] font-medium uppercase tracking-widest">{displayRole}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Account Identity</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#a8b2bf] text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Gamer Tag
                  </Label>
                  <Input
                    value={username}
                    readOnly
                    disabled
                    className="bg-white/5 border-white/5 text-white/50 opacity-70 cursor-not-allowed h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#a8b2bf] text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Organization Status
                  </Label>
                  <Input
                    value={displayRole}
                    readOnly
                    disabled
                    className="bg-white/5 border-white/5 text-white/50 opacity-70 cursor-not-allowed h-11"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 mt-2 text-[#a8b2bf]/70 text-xs italic bg-white/5 p-3 rounded-lg border border-white/5">
                <AlertCircle className="h-4 w-4 text-[#CE1126] shrink-0 mt-0.5" />
                <p>Gamer Tag and Organization Status are locked to your official CSUN registration. Contact an administrator to request a change.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Gaming Profile</h4>

              <div className="space-y-2">
                <Label className="text-[#a8b2bf] text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Avatar URL
                </Label>
                <Input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-[#CE1126] h-11 transition-all"
                  placeholder="https://example.com/avatar.png"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#a8b2bf] text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" /> Key Game
                  </Label>
                  <Select value={games} onValueChange={setGames}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:ring-[#CE1126] h-11 transition-all">
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131318] border-white/10 text-white">
                      {POPULAR_GAMES.map(g => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#a8b2bf] text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                    <Swords className="h-4 w-4" /> Main Role
                  </Label>
                  <Select value={mainRole} onValueChange={setMainRole}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:ring-[#CE1126] h-11 transition-all">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131318] border-white/10 text-white max-h-[300px]">
                      <SelectGroup>
                        <SelectLabel className="text-[#CE1126] font-bold">Valorant</SelectLabel>
                        <SelectItem value="Duelist">Duelist</SelectItem>
                        <SelectItem value="Initiator">Initiator</SelectItem>
                        <SelectItem value="Controller">Controller</SelectItem>
                        <SelectItem value="Sentinel">Sentinel</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[#CE1126] font-bold">League of Legends</SelectLabel>
                        <SelectItem value="Top Laner">Top Laner</SelectItem>
                        <SelectItem value="Jungler">Jungler</SelectItem>
                        <SelectItem value="Mid Laner">Mid Laner</SelectItem>
                        <SelectItem value="ADC">ADC</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[#CE1126] font-bold">General / Other</SelectLabel>
                        <SelectItem value="IGL">IGL (In-Game Leader)</SelectItem>
                        <SelectItem value="AWPer">AWPer / Sniper</SelectItem>
                        <SelectItem value="Entry Fragger">Entry Fragger</SelectItem>
                        <SelectItem value="Tank">Tank</SelectItem>
                        <SelectItem value="DPS">DPS</SelectItem>
                        <SelectItem value="Flex">Flex / Fill</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 text-white font-bold py-6 mt-8 rounded-xl transition-all shadow-lg shadow-[#CE1126]/20 group text-lg"
            >
              {isSaving ? "Saving Changes..." : (
                <>
                  <Save className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
