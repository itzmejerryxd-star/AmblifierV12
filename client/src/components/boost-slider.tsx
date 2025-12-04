import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, ZapOff } from "lucide-react";

interface BoostSliderProps {
  boostLevel: number;
  isBoostEnabled: boolean;
  onBoostLevelChange: (level: number) => void;
  onToggleBoost: (enabled: boolean) => void;
}

export function BoostSlider({
  boostLevel,
  isBoostEnabled,
  onBoostLevelChange,
  onToggleBoost,
}: BoostSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getBoostColor = useCallback((level: number) => {
    if (level < 200) return "text-chart-1";
    if (level < 500) return "text-chart-2";
    if (level < 800) return "text-chart-3";
    return "text-chart-4";
  }, []);

  const getProgressGradient = useCallback((level: number) => {
    const percentage = (level / 1000) * 100;
    if (level < 200) {
      return `linear-gradient(to right, hsl(var(--chart-1)) ${percentage}%, hsl(var(--muted)) ${percentage}%)`;
    }
    if (level < 500) {
      return `linear-gradient(to right, hsl(var(--chart-1)) 20%, hsl(var(--chart-2)) ${percentage}%, hsl(var(--muted)) ${percentage}%)`;
    }
    if (level < 800) {
      return `linear-gradient(to right, hsl(var(--chart-1)) 20%, hsl(var(--chart-2)) 50%, hsl(var(--chart-3)) ${percentage}%, hsl(var(--muted)) ${percentage}%)`;
    }
    return `linear-gradient(to right, hsl(var(--chart-1)) 20%, hsl(var(--chart-2)) 50%, hsl(var(--chart-3)) 80%, hsl(var(--chart-4)) ${percentage}%, hsl(var(--muted)) ${percentage}%)`;
  }, []);

  const isHighLevel = boostLevel >= 800;

  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-wide uppercase text-muted-foreground">
              Boost Level
            </h2>
            {isHighLevel && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-destructive/10 text-destructive">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">High Level</span>
              </div>
            )}
          </div>
          <Button
            variant={isBoostEnabled ? "default" : "secondary"}
            size="default"
            onClick={() => onToggleBoost(!isBoostEnabled)}
            className="gap-2"
            data-testid="button-toggle-boost"
          >
            {isBoostEnabled ? (
              <>
                <Zap className="w-4 h-4" />
                <span>Enabled</span>
              </>
            ) : (
              <>
                <ZapOff className="w-4 h-4" />
                <span>Disabled</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <span
              className={`text-7xl font-mono font-bold tracking-tight transition-colors ${
                isBoostEnabled ? getBoostColor(boostLevel) : "text-muted-foreground"
              } ${isDragging ? "scale-105" : ""}`}
              style={{
                transition: "transform 150ms ease-out, color 300ms ease",
              }}
              data-testid="text-boost-level"
            >
              {boostLevel.toFixed(0)}
            </span>
            <span className="absolute -right-12 bottom-2 text-2xl font-mono text-muted-foreground">
              dB
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div
              className="absolute inset-0 h-2 rounded-full top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                background: isBoostEnabled
                  ? getProgressGradient(boostLevel)
                  : "hsl(var(--muted))",
              }}
            />
            <Slider
              value={[boostLevel]}
              min={0}
              max={1000}
              step={1}
              onValueChange={(values) => onBoostLevelChange(values[0])}
              onPointerDown={() => setIsDragging(true)}
              onPointerUp={() => setIsDragging(false)}
              className="relative z-10"
              disabled={!isBoostEnabled}
              data-testid="slider-boost-level"
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>0 dB</span>
            <span>250 dB</span>
            <span>500 dB</span>
            <span>750 dB</span>
            <span>1000 dB</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-6">
          {[0, 100, 250, 500].map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => onBoostLevelChange(preset)}
              disabled={!isBoostEnabled}
              className={`font-mono ${
                boostLevel === preset && isBoostEnabled
                  ? "border-primary text-primary"
                  : ""
              }`}
              data-testid={`button-preset-${preset}`}
            >
              {preset} dB
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
