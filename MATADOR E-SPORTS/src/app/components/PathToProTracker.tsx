import { Check, Lock } from "lucide-react";

export function PathToProTracker() {
  const steps = [
    { label: "Join a Club", completed: true, locked: false },
    { label: "Log Ranked Stats", completed: true, locked: false },
    { label: "Enter Open Scrims", completed: false, locked: false, current: true },
    { label: "Varsity Tryouts", completed: false, locked: true },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl text-white mb-1">Path to Pro</h2>
          <p className="text-[#a8b2bf] text-sm">Your roadmap to varsity E-Sports</p>
        </div>
        <div className="text-right">
          <p className="text-[#CE1126] text-2xl">50%</p>
          <p className="text-[#a8b2bf] text-xs">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background Track */}
        <div className="h-2 bg-white/10 rounded-full mb-6" />
        
        {/* Progress Fill */}
        <div 
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-[#CE1126] to-[#CE1126]/70 rounded-full transition-all duration-500"
          style={{ width: '50%' }}
        />

        {/* Steps */}
        <div className="flex justify-between -mt-5">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              {/* Step Circle */}
              <div
                className={`
                  relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all
                  ${step.completed 
                    ? "bg-[#CE1126] ring-4 ring-[#CE1126]/20" 
                    : step.current
                    ? "bg-white/10 ring-4 ring-[#CE1126]/40 backdrop-blur-sm"
                    : "bg-white/5 backdrop-blur-sm"
                  }
                `}
              >
                {step.completed ? (
                  <Check className="h-6 w-6 text-white" />
                ) : step.locked ? (
                  <Lock className="h-5 w-5 text-[#a8b2bf]" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-[#a8b2bf]" />
                )}
              </div>

              {/* Label */}
              <p
                className={`
                  text-sm text-center max-w-[100px]
                  ${step.completed || step.current ? "text-white" : "text-[#a8b2bf]"}
                `}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
