import { Github } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PIXEL_FONT, type ObfuscationState } from "./options";

type Key = keyof ObfuscationState;

interface ToggleDef {
  key: Extract<Key, string>;
  label: string;
  description: string | ((ctx: { inputIsOneLiner: boolean }) => string);
  disabledWhen?: (ctx: { inputIsOneLiner: boolean }) => boolean;
}

interface Props {
  options: ObfuscationState;
  inputIsOneLiner: boolean;
  onToggle: (key: Extract<Key, string>, value: boolean) => void;
  githubUrl: string;
}



const TOGGLES: ToggleDef[] = [
  {
    key: "oneLiner",
    label: "One-liner",
    description: ({ inputIsOneLiner }) => inputIsOneLiner ? "Input is already one-liner." : "Collapses the script into a single line.",
    disabledWhen: ({ inputIsOneLiner }) => inputIsOneLiner,
  },
  {
    key: "renameVarsFlag",
    label: "Rename variables",
    description: "Replaces variable names with generated iterators.",
  },
  {
    key: "replaceBooleansFlag",
    label: "Replace $true / $false",
    description: "Swaps booleans for equivalent expressions.",
  },
  {
    key: "replacePwdFlag",
    label: "Replace pwd",
    description: "Rewrites pwd references into indirect forms.",
  },
  {
    key: "randomizeCaseFlag",
    label: "Randomize case",
    description: "Randomizes letter case across identifiers.",
  },
  {
    key: "addQuoteFlag",
    label: "Add quotes",
    description: "Wraps strings with additional quoting.",
  },
  {
    key: "addCommentsFlag",
    label: "Add comments",
    description: "Inserts junk comments through the script.",
  },
  {
    key: "removeCommentsFlag",
    label: "Remove comments",
    description: "Strips original comments before other transforms.",
  },
  {
    key: "addValidateFlag",
    label: "Add sandbox check",
    description: "Prepends an anti-analysis validation stub.",
  },
];



export function OptionsPanel({ options, inputIsOneLiner, onToggle, githubUrl }: Props) {
  const ctx = { inputIsOneLiner };
  return (
    <aside className="space-y-4 flex flex-col">
 
      <h2 className="text-[10px] uppercase tracking-wider text-muted-foreground" style={PIXEL_FONT}>
        Obfuscation options
      </h2>
 
      <Card className="p-4">
 
        <div className="space-y-3">
      
          {TOGGLES.map((t) => {
            const disabled = t.disabledWhen?.(ctx) ?? false;
            const description = typeof t.description === "function" ? t.description(ctx) : t.description;
           
            return (
              <OptionRow
                key={t.key}
                id={t.key}
                label={t.label}
                description={description}
                checked={options[t.key] as boolean}
                onChange={(v) => onToggle(t.key, v)}
                disabled={disabled}
              />
            );
          })}
        
        </div>
      
      </Card>

      <p className="text-[9px] leading-relaxed text-muted-foreground mt-auto" style={PIXEL_FONT}> For more details, check out:{" "}
        
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 underline decoration-muted-foreground/50 hover:text-primary transition-colors align-middle"
        >
        
          <Github className="h-6 w-6" />
          <span className="sr-only">GitHub</span>
       
        </a>
     
      </p>
    
    </aside>
  );
}

function OptionRow(
  {
    id, label, description, checked, onChange, disabled
  }: 
  {
    id: string; label: string; description: string; checked: boolean;onChange: (v: boolean) => void; disabled?: boolean;
  }
) {
  return (
    <div className={`space-y-1 ${disabled ? "opacity-50" : ""}`}>
      
      <div className="flex items-center justify-between gap-2">
      
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer truncate">
          {label}
        </Label>
      
        <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
     
      </div>
     
      <p className="text-[11px] text-muted-foreground font-mono leading-snug">{description}</p>
    
    </div>
  );
}
