import { useCallback } from "react";
import { Header } from "@/components/header";
import { DeviceSelector } from "@/components/device-selector";
import { BoostSlider } from "@/components/boost-slider";
import { AudioLevelMeter } from "@/components/audio-level-meter";
import { WaveformVisualizer } from "@/components/waveform-visualizer";
import { ControlButtons } from "@/components/control-buttons";
import { useAudioContext } from "@/hooks/use-audio-context";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const { toast } = useToast();
  const {
    devices,
    settings,
    audioLevel,
    isConnected,
    error,
    initializeAudioContext,
    updateBoostLevel,
    toggleBoost,
    toggleMute,
    selectInputDevice,
    selectOutputDevice,
    getWaveformData,
    getFrequencyData,
    enumerateDevices,
  } = useAudioContext();

  const handleConnect = useCallback(async () => {
    if (!settings.inputDeviceId) {
      toast({
        title: "No input device selected",
        description: "Please select an input device first.",
        variant: "destructive",
      });
      return;
    }
    await initializeAudioContext(settings.inputDeviceId);
    toast({
      title: "Audio connected",
      description: "Audio stream is now active.",
    });
  }, [settings.inputDeviceId, initializeAudioContext, toast]);

  const handleRefreshDevices = useCallback(() => {
    enumerateDevices();
    toast({
      title: "Devices refreshed",
      description: "Audio device list has been updated.",
    });
  }, [enumerateDevices, toast]);

  const handleResetSettings = useCallback(() => {
    updateBoostLevel(0);
    toggleBoost(false);
    toggleMute(false);
    toast({
      title: "Settings reset",
      description: "All audio settings have been reset to defaults.",
    });
  }, [updateBoostLevel, toggleBoost, toggleMute, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ControlButtons
          isConnected={isConnected}
          isMuted={settings.isMuted}
          onConnect={handleConnect}
          onToggleMute={toggleMute}
          onRefreshDevices={handleRefreshDevices}
          onResetSettings={handleResetSettings}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DeviceSelector
            type="input"
            devices={devices}
            selectedDeviceId={settings.inputDeviceId}
            onDeviceChange={selectInputDevice}
            isConnected={isConnected}
          />
          <DeviceSelector
            type="output"
            devices={devices}
            selectedDeviceId={settings.outputDeviceId}
            onDeviceChange={selectOutputDevice}
            isConnected={isConnected}
          />
        </div>

        <BoostSlider
          boostLevel={settings.boostLevel}
          isBoostEnabled={settings.isBoostEnabled}
          onBoostLevelChange={updateBoostLevel}
          onToggleBoost={toggleBoost}
        />

        <AudioLevelMeter
          level={audioLevel}
          isActive={isConnected && !settings.isMuted}
          boostLevel={settings.isBoostEnabled ? settings.boostLevel : 0}
        />

        <WaveformVisualizer
          getWaveformData={getWaveformData}
          getFrequencyData={getFrequencyData}
          isActive={isConnected && !settings.isMuted}
        />

        <footer className="text-center py-8 border-t border-border/50 mt-8">
          <p className="text-xs text-muted-foreground">
            Audio Boost Pro - For use with Discord and other voice applications
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Note: Extreme boost levels may cause audio distortion
          </p>
        </footer>
      </main>
    </div>
  );
}
