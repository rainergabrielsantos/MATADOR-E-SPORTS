import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, User, ArrowRight, UserCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth, Role } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [csunId, setCsunId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Member");

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (csunId && password) {
      setIsLoading(true);
      setErrorMsg("");
      try {
        if (isSignUp) {
          await register(csunId, password, role, username);
        } else {
          await login(csunId, password);
        }
        navigate("/dashboard");
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          setErrorMsg("An account with this CSUN ID already exists.");
        } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
          setErrorMsg("Invalid CSUN ID or Password. Please try again.");
        } else {
          setErrorMsg(err.message || "An error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/login-bg.png')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0a0a0f]/80 to-[#CE1126]/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-[#CE1126] rounded-2xl mb-6 shadow-2xl shadow-[#CE1126]/40 animate-bounce-subtle">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2 uppercase italic">
            Matador <span className="text-[#CE1126]">E-Sports</span>
          </h1>
          <p className="text-[#a8b2bf] text-lg">CSUN's Official Gaming Hub</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#a8b2bf] mb-2 px-1">
                CSUN ID Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a8b2bf] group-focus-within:text-[#CE1126] transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={csunId}
                  onChange={(e) => setCsunId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 focus:border-transparent transition-all"
                  placeholder="012345678"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#a8b2bf] mb-2 px-1">
                    Gamer Tag / Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a8b2bf] group-focus-within:text-[#CE1126] transition-colors">
                      <UserCircle className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 focus:border-transparent transition-all"
                      placeholder="MatadorPro"
                      required={isSignUp}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a8b2bf] mb-2 px-1">
                    Access Level
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a8b2bf] group-focus-within:text-[#CE1126] transition-colors">
                      <Shield className="h-5 w-5" />
                    </div>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 focus:border-transparent transition-all [&>option]:bg-[#131318] [&>option]:text-white"
                    >
                      <option value="Member">Member</option>
                      <option value="Player">Player (Varsity)</option>
                      <option value="Coach">Coach (Staff)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#a8b2bf] mb-2 px-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a8b2bf] group-focus-within:text-[#CE1126] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-[#CE1126]/10 border border-[#CE1126]/20 rounded-xl p-4 text-center">
                <p className="text-[#CE1126] text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#CE1126] hover:bg-[#CE1126]/90 text-white py-6 rounded-xl text-lg font-bold shadow-lg shadow-[#CE1126]/20 transition-all active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(""); }}
              className="text-sm text-[#a8b2bf] hover:text-[#CE1126] transition-colors cursor-pointer"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-white/30 uppercase tracking-widest">
              <div className="h-px w-8 bg-white/10" />
              <span>Security Verified</span>
              <div className="h-px w-8 bg-white/10" />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-10 text-center text-[#a8b2bf]/60 text-sm">
          California State University, Northridge<br/>
          Department of Student Life & E-Sports
        </p>
      </div>

      {/* Decorative Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#CE1126]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#a8b2bf]/10 rounded-full blur-[100px]" />
    </div>
  );
}
