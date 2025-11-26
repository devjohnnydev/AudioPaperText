import { ReactNode } from "react";
import { Settings, Zap, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="bg-background/80 backdrop-blur-lg sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 duration-300">
              <Zap className="h-6 w-6 fill-current" />
            </div>
            <h1 className="font-bold text-2xl tracking-tight text-foreground">Trust</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center bg-secondary/50 p-1.5 rounded-full border border-border/50">
            <Button 
              variant={location === "/chat" ? "secondary" : "ghost"} 
              size="sm" 
              className={`rounded-full px-4 gap-2 ${location === "/chat" ? 'bg-white shadow-sm text-primary font-medium' : 'text-muted-foreground'}`}
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
            <Button 
              variant={location === "/" ? "secondary" : "ghost"} 
              size="sm" 
              className={`rounded-full px-4 gap-2 ${location === "/" ? 'bg-white shadow-sm text-primary font-medium' : 'text-muted-foreground'}`}
            >
              <FileText className="h-4 w-4" />
              Transcrição
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary/20">
              AI
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="py-8 border-t border-border/40 bg-white/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Trust AI. Tecnologia de transcrição segura e precisa.
          </p>
        </div>
      </footer>
    </div>
  );
}