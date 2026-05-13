import { Star, StarHalf } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleClick = (index: number, isHalf: boolean) => {
    onChange(index + (isHalf ? 0.5 : 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      setHoverValue(index + 0.5);
    } else {
      setHoverValue(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFull = displayValue >= starValue;
        const isHalf = displayValue >= starValue - 0.5 && displayValue < starValue;

        return (
          <div
            key={i}
            className="relative cursor-pointer transition-transform active:scale-90"
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => handleClick(i, hoverValue === i + 0.5)}
          >
            {isHalf ? (
              <div className="relative">
                <Star className="h-6 w-6 text-white/10" />
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
            ) : isFull ? (
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            ) : (
              <Star className="h-6 w-6 text-white/10" />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface AnimatedProgressBarProps {
  value: number;
  max: number;
  color?: string;
}

export function AnimatedProgressBar({ value, max, color = "bg-blue-500" }: AnimatedProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
