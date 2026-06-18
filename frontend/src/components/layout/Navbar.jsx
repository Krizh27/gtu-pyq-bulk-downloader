import { Link, useLocation } from "wouter";
import { Download, Info, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            GTU PYQ
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/download" className="contents">
            <Button
              variant={location === "/download" ? "secondary" : "ghost"}
              className={`gap-2 ${location === "/download" ? "bg-white/10" : "text-muted-foreground hover:text-white"}`}>
              
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Downloader</span>
            </Button>
          </Link>
          <Link href="/about" className="contents">
            <Button
              variant={location === "/about" ? "secondary" : "ghost"}
              className={`gap-2 ${location === "/about" ? "bg-white/10" : "text-muted-foreground hover:text-white"}`}>
              
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>);

}