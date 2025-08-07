import * as React from "react";
import { cn } from "@/lib/utils";

const ToggleGroup = React.forwardRef(({ 
  className, 
  value, 
  onValueChange, 
  children, 
  type = "single",
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef(({ 
  className, 
  children, 
  value, 
  selected,
  onSelect,
  ...props 
}, ref) => {
  return (
    <button
      type="button"
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-muted-foreground/10",
        className
      )}
      onClick={() => onSelect?.(value)}
      data-state={selected ? "on" : "off"}
      {...props}
    >
      {children}
    </button>
  );
});

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };