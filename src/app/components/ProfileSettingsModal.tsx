import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { Save, User as UserIcon, Image as ImageIcon } from "lucide-react";

export function ProfileSettingsModal({ children }: { children: React.ReactNode }) {
  const { user, updateProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [username, setUsername] = useState(user?.username || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ username, avatar });
      toast.success("Profile updated successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#131318]/90 backdrop-blur-xl border-white/10 text-white shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase italic tracking-wider flex items-center gap-2">
            Profile <span className="text-[#CE1126]">Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Avatar className="h-24 w-24 ring-4 ring-[#CE1126] shadow-xl shadow-[#CE1126]/20">
              <AvatarImage src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'Matador'}`} />
              <AvatarFallback className="text-2xl">{username?.[0] || 'M'}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-[#a8b2bf] text-center max-w-[250px]">
              Your avatar is currently generated using your Gamer Tag. Paste an image URL below to override it.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#a8b2bf] text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> Gamer Tag
              </Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10 text-white focus-visible:ring-[#CE1126]"
                placeholder="MatadorPro"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#a8b2bf] text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Avatar URL
              </Label>
              <Input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="bg-white/5 border-white/10 text-white focus-visible:ring-[#CE1126]"
                placeholder="https://example.com/my-avatar.png"
              />
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 text-white font-bold py-6 rounded-xl transition-all shadow-lg shadow-[#CE1126]/20 group"
          >
            {isSaving ? "Saving..." : (
              <>
                <Save className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
