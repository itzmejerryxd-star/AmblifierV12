import { Headphones, Signal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  isConnected: boolean;
}

export function Header({ isConnected }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full max-w-5xl mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight" data-testid="text-app-title">
              Audio Boost Pro
            </h1>
            <span className="text-xs text-muted-foreground">
              Discord Input Amplifier
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className="gap-1.5"
            data-testid="badge-connection-status"
          >
            <Signal className={`w-3 h-3 ${isConnected ? "animate-pulse" : ""}`} />
            {isConnected ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
    </header>
  );
}
