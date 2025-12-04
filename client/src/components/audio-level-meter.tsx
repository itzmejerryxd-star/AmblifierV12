import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AudioLevelMeterProps {
  level: number;
  isActive: boolean;
  boostLevel: number;
}

const DB_MARKERS = [-60, -40, -20, -10, -6, -3, 0, 3, 6];

export function AudioLevelMeter({ level, isActive, boostLevel }: AudioLevelMeterProps) {
  const segments = useMemo(() => {
    const totalSegments = 40;
    const activeSegments = Math.floor((level / 100) * totalSegments);
    
    return Array.from({ length: totalSegments }, (_, i) => {
      const percentage = (i / totalSegments) * 100;
      let color: string;
      
      if (percentage < 60) {
        color = "bg-chart-1";
      } else if (percentage < 80) {
        color = "bg-chart-2";
      } else if (percentage < 95) {
        color = "bg-chart-3";
      } else {
        color = "bg-chart-4";
      }
      
      return {
        active: i < activeSegments,
        color,
        percentage,
      };
    });
  }, [level]);

  const boostedLevel = useMemo(() => {
    const gainFactor = Math.pow(10, boostLevel / 20);
    return Math.min(100, level * gainFactor);
  }, [level, boostLevel]);

  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Audio Level
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Input:</span>
              <span className="font-mono text-sm font-bold text-foreground" data-testid="text-input-level">
                {level.toFixed(1)} dB
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Output:</span>
              <span className="font-mono text-sm font-bold text-primary" data-testid="text-output-level">
                {boostedLevel.toFixed(1)} dB
              </span>
            </div>
          </div>
        </div>

        <div className="relative h-12 rounded-lg bg-background/50 overflow-hidden border border-border/50">
          <div className="absolute inset-0 flex items-center gap-0.5 px-2">
            {segments.map((segment, i) => (
              <div
                key={i}
                className={`flex-1 h-8 rounded-sm transition-all duration-75 ${
                  segment.active && isActive
                    ? segment.color
                    : "bg-muted/30"
                }`}
                style={{
                  opacity: segment.active && isActive ? 1 : 0.3,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-end justify-between px-2 pb-1 pointer-events-none">
            {DB_MARKERS.map((db) => (
              <div key={db} className="flex flex-col items-center">
                <div className="w-px h-2 bg-muted-foreground/30" />
                <span className="text-[9px] font-mono text-muted-foreground/50 mt-0.5">
                  {db}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-1" />
            <span className="text-xs text-muted-foreground">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-2" />
            <span className="text-xs text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-3" />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-4" />
            <span className="text-xs text-muted-foreground">Peak</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
