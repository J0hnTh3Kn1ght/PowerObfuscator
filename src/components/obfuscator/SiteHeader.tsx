import logo from "@/assets/logo.png";
import { PIXEL_FONT } from "./options";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      
      <div className="max-w-[1500px] mx-auto px-6 py-4 flex items-center justify-end gap-4">
        <h1 className="text-xl leading-none tracking-tight text-foreground" style={PIXEL_FONT}>
          PowerObfuscator
        </h1>
      
        <img src={logo} alt="PowerObfuscator mascot" className="h-12 w-12 object-contain" />      
      </div>
    
    </header>
  );
}
