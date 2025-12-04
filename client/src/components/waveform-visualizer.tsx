import { useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface WaveformVisualizerProps {
  getWaveformData: () => Float32Array;
  getFrequencyData: () => Uint8Array;
  isActive: boolean;
}

export function WaveformVisualizer({
  getWaveformData,
  getFrequencyData,
  isActive,
}: WaveformVisualizerProps) {
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const frequencyCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const drawWaveform = useCallback((canvas: HTMLCanvasElement, data: Float32Array) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "hsl(220, 15%, 6%)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "hsl(220, 10%, 12%)";
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 20; i++) {
      const x = (width / 20) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    ctx.strokeStyle = "hsl(220, 10%, 18%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    if (!isActive) {
      ctx.strokeStyle = "hsl(220, 10%, 30%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "hsl(142, 70%, 45%)");
    gradient.addColorStop(0.5, "hsl(142, 70%, 55%)");
    gradient.addColorStop(1, "hsl(142, 70%, 45%)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      const y = (v * height) / 2 + height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();

    ctx.shadowColor = "hsl(142, 70%, 45%)";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [isActive]);

  const drawFrequency = useCallback((canvas: HTMLCanvasElement, data: Uint8Array) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "hsl(220, 15%, 6%)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "hsl(220, 10%, 12%)";
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!isActive) {
      const barCount = 64;
      const barWidth = (width / barCount) * 0.8;
      const gap = (width / barCount) * 0.2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        ctx.fillStyle = "hsl(220, 10%, 15%)";
        ctx.fillRect(x, height - 4, barWidth, 4);
      }
      return;
    }

    const barCount = 64;
    const barWidth = (width / barCount) * 0.8;
    const gap = (width / barCount) * 0.2;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * data.length);
      const value = data[dataIndex];
      const barHeight = (value / 255) * height;
      const x = i * (barWidth + gap);

      const percentage = i / barCount;
      let color: string;
      
      if (percentage < 0.6) {
        color = "hsl(142, 70%, 45%)";
      } else if (percentage < 0.8) {
        color = "hsl(48, 90%, 50%)";
      } else if (percentage < 0.95) {
        color = "hsl(25, 90%, 50%)";
      } else {
        color = "hsl(0, 84%, 50%)";
      }

      const gradient = ctx.createLinearGradient(x, height, x, height - barHeight);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color.slice(0, -1)}, 0.5)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      ctx.fillStyle = "hsla(142, 70%, 45%, 0.3)";
      ctx.fillRect(x, height - 4, barWidth, 4);
    }
  }, [isActive]);

  useEffect(() => {
    const waveformCanvas = waveformCanvasRef.current;
    const frequencyCanvas = frequencyCanvasRef.current;
    
    if (!waveformCanvas || !frequencyCanvas) return;

    const resizeCanvases = () => {
      const dpr = window.devicePixelRatio || 1;
      
      const waveformRect = waveformCanvas.getBoundingClientRect();
      waveformCanvas.width = waveformRect.width * dpr;
      waveformCanvas.height = waveformRect.height * dpr;
      const waveformCtx = waveformCanvas.getContext("2d");
      if (waveformCtx) {
        waveformCtx.scale(dpr, dpr);
      }

      const frequencyRect = frequencyCanvas.getBoundingClientRect();
      frequencyCanvas.width = frequencyRect.width * dpr;
      frequencyCanvas.height = frequencyRect.height * dpr;
      const frequencyCtx = frequencyCanvas.getContext("2d");
      if (frequencyCtx) {
        frequencyCtx.scale(dpr, dpr);
      }
    };

    resizeCanvases();
    window.addEventListener("resize", resizeCanvases);

    const animate = () => {
      const waveformData = getWaveformData();
      const frequencyData = getFrequencyData();
      
      drawWaveform(waveformCanvas, waveformData);
      drawFrequency(frequencyCanvas, frequencyData);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvases);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [getWaveformData, getFrequencyData, drawWaveform, drawFrequency]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">
            Waveform
          </h2>
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border/50">
            <canvas
              ref={waveformCanvasRef}
              className="w-full h-full"
              style={{ display: "block" }}
              data-testid="canvas-waveform"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">
            Frequency Spectrum
          </h2>
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border/50">
            <canvas
              ref={frequencyCanvasRef}
              className="w-full h-full"
              style={{ display: "block" }}
              data-testid="canvas-frequency"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
