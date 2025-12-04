import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  showSlider?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, showSlider = false, ...props }, ref) => (
  <div className="relative w-full py-2">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-button-hover transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
    {showSlider && (
      <div 
        className="absolute top-1/2 -translate-y-1/2 block h-5 w-5 rounded-full border-2 border-button-hover bg-background"
        style={{ left: `calc(${value || 0}% - 10px)` }}
      />
    )}
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
