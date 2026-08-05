interface Band {
  label: string;
  text: string;
  dot: string;
}

function bandFor(value: number): Band {
  if (value <= 1) return { label: "Low", text: "text-emerald-400", dot: "bg-emerald-400" };
  if (value <= 3) return { label: "Moderate", text: "text-amber-400", dot: "bg-amber-400" };
  return { label: "High", text: "text-red-400", dot: "bg-red-400" };
}

export function EntropyReadout({ value, label }: { value: number; label: string }) {
  const band = bandFor(value);
  return (
    
    <div className="border-t border-border bg-muted/30 px-4 py-2.5 flex items-center justify-between">
    
      <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
        {label} entropy
      </span>
    
      <div className="flex items-center gap-3">
    
        <span className="font-mono text-sm tabular-nums text-foreground font-semibold">
          {value.toFixed(3)}
        </span>
    
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${band.dot}`} />
          <span className={`text-[11px] font-mono ${band.text}`}>{band.label}</span>
        </span>
    
      </div>
    
    </div>
  );
}
