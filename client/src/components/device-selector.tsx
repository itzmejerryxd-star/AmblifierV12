import { Mic, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AudioDevice } from "@shared/schema";

interface DeviceSelectorProps {
  type: "input" | "output";
  devices: AudioDevice[];
  selectedDeviceId: string;
  onDeviceChange: (deviceId: string) => void;
  isConnected: boolean;
}

export function DeviceSelector({
  type,
  devices,
  selectedDeviceId,
  onDeviceChange,
  isConnected,
}: DeviceSelectorProps) {
  const filteredDevices = devices.filter(
    (d) => d.kind === (type === "input" ? "audioinput" : "audiooutput")
  );

  const Icon = type === "input" ? Mic : Volume2;
  const label = type === "input" ? "Input Device" : "Output Device";

  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              {label}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-primary animate-pulse" : "bg-muted-foreground"
                }`}
                data-testid={`status-${type}-device`}
              />
              <span className="text-xs text-muted-foreground">
                {isConnected ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <Select value={selectedDeviceId} onValueChange={onDeviceChange}>
          <SelectTrigger
            className="w-full h-12 bg-background/50 border-border/50 hover-elevate"
            data-testid={`select-${type}-device`}
          >
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => (
                <SelectItem
                  key={device.deviceId}
                  value={device.deviceId}
                  data-testid={`option-${type}-${device.deviceId}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate">{device.label}</span>
                    {device.isDefault && (
                      <span className="text-xs text-primary">(Default)</span>
                    )}
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-device" disabled>
                No devices found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
