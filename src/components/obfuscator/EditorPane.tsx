import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EntropyReadout } from "./EntropyReadout";

interface Props {
  input: string;
  output: string;
  inputEntropy: number;
  outputEntropy: number;
  onInputChange: (value: string) => void;
}

export function EditorPane({ input, output, inputEntropy, outputEntropy, onInputChange }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
    
      <Card className="p-0 overflow-hidden flex flex-col">
    
        <PaneTitle>input.ps1</PaneTitle>
    
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className="min-h-[420px] font-mono text-sm rounded-none border-0 resize-none focus-visible:ring-0"
          placeholder="Paste your PowerShell payload here..."
          spellCheck={false}
        />
    
        <EntropyReadout value={inputEntropy} label="Input" />
    
      </Card>

      <Card className="p-0 overflow-hidden flex flex-col">
        
        <PaneTitle>output.ps1</PaneTitle>
        
        <pre className="min-h-[420px] max-h-[420px] overflow-auto font-mono text-sm p-3 bg-card whitespace-pre-wrap break-all flex-1">
          {output || <span className="text-muted-foreground">// output appears here</span>}
        </pre>
        
        <EntropyReadout value={outputEntropy} label="Output" />
     
      </Card>
    
    </div>
  );
}

function PaneTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5 border-b border-border bg-muted/40">
      
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {children}
      
      </span>
    
    </div>
  );
}
