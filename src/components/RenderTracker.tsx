import { useEffect, useRef, useState } from "react";

interface RenderTrackerProps {
  name: string;
  children: React.ReactNode;
  className?: string;
  flashClassName?: string;
}

export function RenderTracker({
  name,
  children,
  className = "",
  flashClassName = "",
}: RenderTrackerProps) {
  const [renderCount, setRenderCount] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) {
      // Only increment and flash if component has already mounted (not first render)
      setRenderCount((prev) => prev + 1);
      setIsFlashing(true);

      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      mountedRef.current = true;
      setRenderCount(1);
    }
  }, [children]);

  console.log(`🔄 ${name} rendered (count: ${renderCount})`);

  return (
    <div
      className={`
        relative transition-all duration-500 rounded-lg
        ${
          isFlashing
            ? `bg-yellow-200 shadow-lg shadow-yellow-500/50 ring-2 ring-yellow-400 ${flashClassName}`
            : ""
        }
        ${className}
      `}
    >
      <div className="absolute -top-2 -right-2 z-10">
        <div
          className={`
            inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold rounded-full
            transition-all duration-300
            ${
              isFlashing
                ? "bg-red-500 text-white scale-110"
                : "bg-gray-500 text-white"
            }
          `}
          title={`${name} render count`}
        >
          {renderCount}
        </div>
      </div>
      {children}
    </div>
  );
}
