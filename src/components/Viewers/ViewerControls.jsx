import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { useSignal } from '../../context/SignalContext';
import { Play, Pause, Square, ZoomIn, ZoomOut, RotateCcw, FastForward, Headphones, Server, Music } from 'lucide-react';
import { Separator } from '../ui/separator';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'; // Import ToggleGroup
import { useAudioPlayer } from '@/hooks/useAudioPlayer.js'; // Import the new hook

export const ViewerControls = () => {
    // --- 1. Get ALL signals and the new activeSource state ---
    const {
        originalSignal,
        processedSignal,
        serverOutputSignal,
        activeSource,
        setActiveSource,
        playbackState,
        viewState,
    } = useSignal();

    // --- 2. Use the player hook directly ---
    const player = useAudioPlayer();

    const { isPlaying, speed } = playbackState;
    const { currentTime } = viewState;

    // --- 3. Determine duration based on the ACTIVE buffer ---
    const getDuration = () => {
        if (activeSource === 'input' && originalSignal) return originalSignal.duration;
        if (activeSource === 'eq' && processedSignal) return processedSignal.duration;
        if (activeSource === 'server' && serverOutputSignal) return serverOutputSignal.duration;
        return 0;
    };
    const duration = getDuration();

    const handleSeek = (value) => {
        player.setSeek(value[0]);
    };

    const handleSpeedChange = () => {
        const speeds = [1, 1.25, 1.5, 2, 0.5, 0.75];
        const currentSpeedIndex = speeds.indexOf(speed);
        const nextSpeed = speeds[(currentSpeedIndex + 1) % speeds.length];
        player.setPlaybackSpeed(nextSpeed);
    }

    const handleSourceChange = (value) => {
        if (value) { // Prevent unselecting all
            setActiveSource(value);
        }
    };

    // TODO: Implement Zoom/Pan controls
    const handleZoomIn = () => {};
    const handleZoomOut = () => {};
    const handleReset = () => {};

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-4">
                {/* Group 1: Playback */}
                <div className="flex items-center gap-2">
                    <Button size="icon" onClick={isPlaying ? player.pause : player.play} disabled={!duration}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" onClick={() => player.stop(true)} variant="outline" disabled={!duration}>
                        <Square className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleSpeedChange} variant="outline" disabled={!duration}>
                        <FastForward className="w-4 h-4" />
                        <span className="text-xs">{speed}x</span>
                    </Button>
                </div>

                {/* Separator */}
                <Separator orientation="vertical" className="h-9" />

                {/* --- 4. NEW: Audio Source Toggle --- */}
                <ToggleGroup
                    type="single"
                    value={activeSource}
                    onValueChange={handleSourceChange}
                    aria-label="Audio Source"
                >
                    <ToggleGroupItem value="input" aria-label="Input Signal" disabled={!originalSignal}>
                        <Headphones className="w-4 h-4" />
                        <span className="ml-2">Input</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="eq" aria-label="EQ Output" disabled={!processedSignal}>
                        <Music className="w-4 h-4" />
                        <span className="ml-2">EQ</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="server" aria-label="Server Output" disabled={!serverOutputSignal}>
                        <Server className="w-4 h-4" />
                        <span className="ml-2">Server</span>
                    </ToggleGroupItem>
                </ToggleGroup>

                {/* Separator */}
                <Separator orientation="vertical" className="h-9" />

                {/* Group 3: Scrubber */}
                <div className="flex-1 flex items-center gap-3 px-2">
                    <span className="text-sm text-muted-foreground w-12 text-right">
                        {(currentTime).toFixed(2)}s
                    </span>
                    <Slider
                        min={0}
                        max={duration}
                        step={0.01}
                        value={[currentTime]}
                        onValueChange={handleSeek}
                        disabled={!duration}
                    />
                    <span className="text-sm text-muted-foreground w-12 text-left">
                        {duration.toFixed(2)}s
                    </span>
                </div>

                {/* Separator */}
                <Separator orientation="vertical" className="h-9" />

                {/* Group 4: View Controls */}
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={handleZoomIn}><ZoomIn className="w-4 h-4" /></Button>
                    <Button size="icon" variant="outline" onClick={handleZoomOut}><ZoomOut className="w-4 h-4" /></Button>
                    <Button size="icon" variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4" /></Button>
                </div>
            </div>
        </div>
    );
};