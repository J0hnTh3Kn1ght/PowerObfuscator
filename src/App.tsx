import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { EditorPane } from "@/components/obfuscator/EditorPane";
import { OptionsPanel } from "@/components/obfuscator/OptionsPanel";
import { ParametersPanel } from "@/components/obfuscator/ParametersPanel";
import { SiteHeader } from "@/components/obfuscator/SiteHeader";
import { Toolbar } from "@/components/obfuscator/Toolbar";
import { DEFAULT_OPTIONS, SAMPLE_SCRIPT, type ObfuscationState } from "@/components/obfuscator/options";
import { useObfuscatedOutput } from "@/hooks/use-obfuscated-output";
import { copyText, downloadText } from "@/lib/clipboard";
import { entropy } from "@/lib/obfuscator";
import { looksLikePowerShell } from "@/lib/powershell-detect";

const ALLOWED_UPLOAD_EXTENSIONS = new Set([".ps1", ".txt"]);




function isSingleLine(source: string): boolean {
  const lines = source.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith("#"));
  return lines.length <= 1;
}




function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot).toLowerCase();
}




export function App() {
  
  const [input, setInput] = useState(SAMPLE_SCRIPT);
  const [options, setOptions] = useState<ObfuscationState>(DEFAULT_OPTIONS);

  const inputIsOneLiner = useMemo(() => isSingleLine(input), [input]);
  const inputEntropy = useMemo(() => entropy(input), [input]);

  const output = useObfuscatedOutput(input, options);
  const outputEntropy = useMemo(() => entropy(output), [output]);


  useEffect(() => {
    if (inputIsOneLiner && options.oneLiner) {
      setOptions((prev) => ({ ...prev, oneLiner: false }));
    }
  }, [inputIsOneLiner, options.oneLiner]);


  const patchOptions = useCallback((patch: Partial<ObfuscationState>) => {
    setOptions((prev) => ({ ...prev, ...patch }));
  }, []);


  const toggleOption = useCallback(
    (key: keyof ObfuscationState, value: boolean) => {
      patchOptions({ [key]: value } as Partial<ObfuscationState>);
    }, [patchOptions],
  );


  const handleCopy = useCallback(async () => {
    await copyText(output);
    toast.success("Copied to clipboard");
  }, [output]);


  const handleDownload = useCallback(() => {
    downloadText(output, "obfuscated.ps1");
  }, [output]);


  const handleUpload = useCallback((file: File) => {
    const ext = extensionOf(file.name);
    if (!ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
      toast.error("Only .ps1 and .txt files are allowed.");
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      const content = String(reader.result);
      if (ext === ".ps1" && !looksLikePowerShell(content)) {
        toast.error("The uploaded .ps1 file does not appear to contain valid PowerShell.");
        return;
      }
      setInput(content);
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      <Toaster position="top-right" richColors />
      
      <SiteHeader />
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-6 py-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <OptionsPanel
            options={options}
            inputIsOneLiner={inputIsOneLiner}
            onToggle={toggleOption}
            githubUrl={"https://github.com/J0hnTh3Kn1ght/PowerObfuscator"}
          />

          <section className="space-y-4">
            <Toolbar
              onUpload={handleUpload}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onReset={() => setInput(SAMPLE_SCRIPT)}
            />

            <EditorPane
              input={input}
              output={output}
              inputEntropy={inputEntropy}
              outputEntropy={outputEntropy}
              onInputChange={setInput}
            />

            <ParametersPanel options={options} onChange={patchOptions} />

          </section>
        </div>

      </main>
    </div>
  );
}
