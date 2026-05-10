import { Sparkles } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative h-72 rounded-xl overflow-hidden mb-6">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1772587003187-65b32c91df91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwdG91cm5hbWVudCUyMGNvbXBldGl0aXZlfGVufDF8fHx8MTc3NTcxNzExNXww&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-6 w-6 text-[#CE1126]" />
          <span className="text-[#a8b2bf] tracking-wide uppercase text-sm">
            Welcome to CSUN E-Sports
          </span>
        </div>
        <h1 className="text-5xl mb-3 tracking-tight">
          <span className="text-white">Play, </span>
          <span className="text-white">Compete, </span>
          <span className="text-[#CE1126]">Dominate.</span>
        </h1>
        <p className="text-[#a8b2bf] text-lg max-w-2xl">
          Join California State University Northridge's premier E-Sports community. 
          Connect with fellow gamers, climb the ranks, and take your shot at varsity glory.
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#CE1126]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-32 w-48 h-48 bg-[#a8b2bf]/10 rounded-full blur-3xl" />
    </div>
  );
}
