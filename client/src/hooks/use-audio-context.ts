import { useState, useEffect, useCallback, useRef } from "react";
import type { AudioDevice, AudioSettings } from "@shared/schema";

interface AudioContextState {
  audioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;
  gainNode: GainNode | null;
  sourceNode: MediaStreamAudioSourceNode | null;
  mediaStream: MediaStream | null;
  destinationNode: MediaStreamAudioDestinationNode | null;
  audioElement: HTMLAudioElement | null;
}

export function useAudioContext() {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [settings, setSettings] = useState<AudioSettings>({
    inputDeviceId: "",
    outputDeviceId: "",
    boostLevel: 0,
    isBoostEnabled: false,
    isMuted: false,
  });
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioStateRef = useRef<AudioContextState>({
    audioContext: null,
    analyserNode: null,
    gainNode: null,
    sourceNode: null,
    mediaStream: null,
    destinationNode: null,
    audioElement: null,
  });

  const animationFrameRef = useRef<number | null>(null);

  const enumerateDevices = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioDevices: AudioDevice[] = deviceList
        .filter((d) => d.kind === "audioinput" || d.kind === "audiooutput")
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `${d.kind === "audioinput" ? "Microphone" : "Speaker"} ${d.deviceId.slice(0, 5)}`,
          kind: d.kind as "audioinput" | "audiooutput",
          isDefault: d.deviceId === "default",
        }));
      setDevices(audioDevices);

      const defaultInput = audioDevices.find((d) => d.kind === "audioinput");
      const defaultOutput = audioDevices.find((d) => d.kind === "audiooutput");

      if (defaultInput && !settings.inputDeviceId) {
        setSettings((prev) => ({ ...prev, inputDeviceId: defaultInput.deviceId }));
      }
      if (defaultOutput && !settings.outputDeviceId) {
        setSettings((prev) => ({ ...prev, outputDeviceId: defaultOutput.deviceId }));
      }
    } catch (err) {
      setError("Failed to access audio devices. Please grant microphone permissions.");
    }
  }, [settings.inputDeviceId, settings.outputDeviceId]);

  const cleanupAudioContext = useCallback(async () => {
    const state = audioStateRef.current;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (state.audioElement) {
      state.audioElement.pause();
      state.audioElement.srcObject = null;
      state.audioElement = null;
    }

    if (state.mediaStream) {
      state.mediaStream.getTracks().forEach((track) => track.stop());
      state.mediaStream = null;
    }

    if (state.sourceNode) {
      state.sourceNode.disconnect();
      state.sourceNode = null;
    }

    if (state.gainNode) {
      state.gainNode.disconnect();
      state.gainNode = null;
    }

    if (state.analyserNode) {
      state.analyserNode.disconnect();
      state.analyserNode = null;
    }

    if (state.destinationNode) {
      state.destinationNode = null;
    }

    if (state.audioContext && state.audioContext.state !== "closed") {
      await state.audioContext.close();
      state.audioContext = null;
    }
  }, []);

  const initializeAudioContext = useCallback(async (deviceId: string) => {
    try {
      await cleanupAudioContext();

      const audioContext = new AudioContext();
      
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      analyserNode.smoothingTimeConstant = 0.8;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1;

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const sourceNode = audioContext.createMediaStreamSource(mediaStream);
      
      const destinationNode = audioContext.createMediaStreamDestination();

      sourceNode.connect(gainNode);
      gainNode.connect(analyserNode);
      gainNode.connect(destinationNode);

      const audioElement = new Audio();
      audioElement.srcObject = destinationNode.stream;
      audioElement.autoplay = true;

      if (settings.outputDeviceId && 'setSinkId' in audioElement) {
        try {
          await (audioElement as any).setSinkId(settings.outputDeviceId);
        } catch (sinkError) {
          console.warn("Failed to set output device:", sinkError);
        }
      }

      audioStateRef.current = {
        audioContext,
        analyserNode,
        gainNode,
        sourceNode,
        mediaStream,
        destinationNode,
        audioElement,
      };

      setIsConnected(true);
      setError(null);
      startLevelMonitoring();
    } catch (err) {
      setError("Failed to initialize audio. Please check your microphone connection.");
      setIsConnected(false);
    }
  }, [settings.outputDeviceId, cleanupAudioContext]);

  const startLevelMonitoring = useCallback(() => {
    const analyser = audioStateRef.current.analyserNode;
    if (!analyser) return;

    const dataArray = new Float32Array(analyser.fftSize);

    const updateLevel = () => {
      analyser.getFloatTimeDomainData(dataArray);
      
      let sumOfSquares = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sumOfSquares += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sumOfSquares / dataArray.length);
      
      const dbValue = rms > 0 ? 20 * Math.log10(rms) : -100;
      const normalizedLevel = Math.min(100, Math.max(0, ((dbValue + 60) / 60) * 100));
      
      setAudioLevel(normalizedLevel);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }, []);

  const updateBoostLevel = useCallback((level: number) => {
    const gainNode = audioStateRef.current.gainNode;
    if (gainNode && gainNode.context.state === "running") {
      const rawGain = settings.isBoostEnabled ? Math.pow(10, level / 20) : 1;
      const gainValue = Math.min(1000, Math.max(0, isFinite(rawGain) ? rawGain : 1));
      gainNode.gain.setTargetAtTime(gainValue, gainNode.context.currentTime, 0.015);
    }
    setSettings((prev) => ({ ...prev, boostLevel: level }));
  }, [settings.isBoostEnabled]);

  const toggleBoost = useCallback((enabled: boolean) => {
    const gainNode = audioStateRef.current.gainNode;
    if (gainNode && gainNode.context.state === "running") {
      const rawGain = enabled ? Math.pow(10, settings.boostLevel / 20) : 1;
      const gainValue = Math.min(1000, Math.max(0, isFinite(rawGain) ? rawGain : 1));
      gainNode.gain.setTargetAtTime(gainValue, gainNode.context.currentTime, 0.015);
    }
    setSettings((prev) => ({ ...prev, isBoostEnabled: enabled }));
  }, [settings.boostLevel]);

  const toggleMute = useCallback((muted: boolean) => {
    const audioElement = audioStateRef.current.audioElement;
    if (audioElement) {
      audioElement.muted = muted;
    }
    setSettings((prev) => ({ ...prev, isMuted: muted }));
  }, []);

  const selectInputDevice = useCallback(async (deviceId: string) => {
    setSettings((prev) => ({ ...prev, inputDeviceId: deviceId }));
    if (isConnected) {
      await initializeAudioContext(deviceId);
    }
  }, [isConnected, initializeAudioContext]);

  const selectOutputDevice = useCallback(async (deviceId: string) => {
    setSettings((prev) => ({ ...prev, outputDeviceId: deviceId }));
    
    const audioElement = audioStateRef.current.audioElement;
    if (audioElement && 'setSinkId' in audioElement) {
      try {
        await (audioElement as any).setSinkId(deviceId);
      } catch (sinkError) {
        console.warn("Failed to set output device:", sinkError);
        setError("Failed to switch output device. Your browser may not support this feature.");
      }
    }
  }, []);

  const getWaveformData = useCallback(() => {
    const analyser = audioStateRef.current.analyserNode;
    if (!analyser) return new Float32Array(128);

    const dataArray = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatTimeDomainData(dataArray);
    return dataArray;
  }, []);

  const getFrequencyData = useCallback(() => {
    const analyser = audioStateRef.current.analyserNode;
    if (!analyser) return new Uint8Array(128);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }, []);

  useEffect(() => {
    enumerateDevices();

    const handleDeviceChange = () => {
      enumerateDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
      cleanupAudioContext();
    };
  }, [enumerateDevices, cleanupAudioContext]);

  return {
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
  };
}
