import { useRouteError, Link } from "react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

export function ErrorBoundary() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-[#131318] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 bg-[#CE1126]/10 rounded-full flex items-center justify-center mx-auto border border-[#CE1126]/20">
          <AlertTriangle className="h-10 w-10 text-[#CE1126]" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">System <span className="text-[#CE1126]">Error</span></h1>
          <p className="text-[#a8b2bf] text-sm leading-relaxed">
            Something went wrong while loading this page. Our engineers (and coaches) have been notified.
          </p>
          {error?.message && (
            <div className="mt-4 p-3 bg-black/40 border border-white/5 rounded-lg text-left">
              <p className="text-[10px] font-mono text-white/40 uppercase mb-1">Error Trace:</p>
              <p className="text-[11px] font-mono text-[#CE1126] break-all">{error.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#CE1126] hover:bg-[#CE1126]/90 text-white w-full gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Reload System
          </Button>
          <Link to="/dashboard">
            <Button variant="ghost" className="w-full text-[#a8b2bf] hover:text-white gap-2">
              <Home className="h-4 w-4" /> Back to Base
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
