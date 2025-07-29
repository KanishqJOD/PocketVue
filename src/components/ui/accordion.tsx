"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a more robust context
const AccordionContext = React.createContext<{
  expanded: string | null;
  setExpanded: React.Dispatch<React.SetStateAction<string | null>>;
}>({ 
  expanded: null,
  setExpanded: () => null,
});

// Create item context to pass value down
const AccordionItemContext = React.createContext<{
  value: string;
}>({ 
  value: "",
});

interface AccordionProps {
  children: React.ReactNode;
  type?: "single";
  defaultValue?: string;
  className?: string;
}

export function Accordion({
  children,
  type = "single",
  defaultValue,
  className,
}: AccordionProps) {
  const [expanded, setExpanded] = React.useState<string | null>(
    defaultValue || null
  );

  return (
    <AccordionContext.Provider value={{ expanded, setExpanded }}>
      <div className={cn("space-y-3", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function AccordionItem({
  children,
  value,
  className,
}: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        className={cn(
          "rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(33,150,243,0.15)]",
          className
        )}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({
  children,
  className,
}: AccordionTriggerProps) {
  const { expanded, setExpanded } = React.useContext(AccordionContext);
  const { value } = React.useContext(AccordionItemContext);

  const isExpanded = expanded === value;

  const handleClick = () => {
    setExpanded(isExpanded ? null : value);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full items-center justify-between p-5 text-left font-medium text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-black/20",
        isExpanded && "bg-gradient-to-r from-blue-900/30 to-black/20",
        className
      )}
      aria-expanded={isExpanded}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-5 w-5 text-blue-400 transition-transform duration-500 ease-out",
          isExpanded ? "rotate-180" : "rotate-0"
        )}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({
  children,
  className,
}: AccordionContentProps) {
  const { expanded } = React.useContext(AccordionContext);
  const { value } = React.useContext(AccordionItemContext);

  const isExpanded = expanded === value;
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number>(0);

  React.useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-500 ease-in-out",
        isExpanded ? `max-h-[${height}px] opacity-100` : "max-h-0 opacity-0"
      )}
      style={{ 
        maxHeight: isExpanded ? `${height}px` : 0,
        opacity: isExpanded ? 1 : 0,
      }}
    >
      <div 
        ref={contentRef}
        className={cn(
          "p-5 pt-0 text-white/80 bg-gradient-to-b from-transparent to-blue-950/10", 
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}