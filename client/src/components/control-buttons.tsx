import { Button } from "@/components/ui/button";
import { Power, RefreshCw, Volume2, VolumeX, Settings2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ControlButtonsProps {
  isConnected: boolean;
  isMuted: boolean;
  onConnect: () => void;
  onToggleMute: (muted: boolean) => void;
  onRefreshDevices: () => void;
  onResetSettings: () => void;
}

export function ControlButtons({
  isConnected,
  isMuted,
  onConnect,
  onToggleMute,
  onRefreshDevices,
  onResetSettings,
}: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            variant={isConnected ? "default" : "secondary"}
            onClick={onConnect}
            className="gap-2 min-w-[140px]"
            data-testid="button-connect"
          >
            <Power className="w-5 h-5" />
            {isConnected ? "Connected" : "Connect"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isConnected ? "Audio stream is active" : "Click to start audio stream"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant={isMuted ? "destructive" : "secondary"}
            onClick={() => onToggleMute(!isMuted)}
            disabled={!isConnected}
            data-testid="button-mute"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isMuted ? "Unmute audio" : "Mute audio"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            onClick={onRefreshDevices}
            data-testid="button-refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Refresh device list</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            onClick={onResetSettings}
            data-testid="button-reset"
          >
            <Settings2 className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset all settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
