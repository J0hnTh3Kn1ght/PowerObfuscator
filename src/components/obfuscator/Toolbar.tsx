import { Copy, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";



interface Props {
  onUpload: (file: File) => void;
  onCopy: () => void;
  onDownload: () => void;
  onReset: () => void;
}




export function Toolbar({ onUpload, onCopy, onDownload, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="cursor-pointer">
        
        <input
          type="file"
          accept=".ps1,.txt,text/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
        
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-border hover:bg-accent transition-colors">
          <Upload className="h-3.5 w-3.5" /> Upload input
        </span>
      
      </label>
      
      <Button size="sm" variant="outline" onClick={onCopy}>
        <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy output
      </Button>
      
      <Button size="sm" variant="outline" onClick={onDownload}>
        <Download className="h-3.5 w-3.5 mr-1.5" /> Download output
      </Button>

      <div className="flex-1" />

      <Button size="sm" variant="ghost" onClick={onReset}>
        Reset sample
      </Button>
    </div>
  );
}
