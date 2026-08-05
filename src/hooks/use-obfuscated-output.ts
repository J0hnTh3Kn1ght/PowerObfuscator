import { useEffect, useState } from "react";
import { obfuscate, type ObfuscateOptions } from "@/lib/obfuscator";
import { looksLikePowerShell } from "@/lib/powershell-detect";
import { type ObfuscationState } from "@/components/obfuscator/options";


export function useObfuscatedOutput(input: string, opts: ObfuscationState): string {
  const [output, setOutput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!looksLikePowerShell(input)) {
        setOutput("The language used here is not PowerShell. Maybe in the future I'll implement support for other languages...");
        return;
      }

      try {
        setOutput(obfuscate(input, opts satisfies ObfuscateOptions));
      } 
      catch (err) {
        setOutput(`# error: ${(err as Error).message}`);
      }
      
    }, 120); // DEBOUNCE_MS
    return () => clearTimeout(timer);
  }, 
  [input, opts]);

  return output;
}
