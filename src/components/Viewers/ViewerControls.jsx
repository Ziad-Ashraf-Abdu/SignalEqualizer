import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { useSignal } from '../../context/SignalContext';
// Import Separator
import { Play, Pause, Square, ZoomIn, ZoomOut, RotateCcw, FastForward } from 'lucide-react';
import { Separator } from '../ui/separator';

export const ViewerControls = ({ player }) => {
    const { playbackState, viewState, setViewState, originalSignal } = useSignal();
    const { isPlaying, speed } = playbackState;
    const { currentTime } = viewState;

    const duration = originalSignal?.duration || 0;

    const handleSeek = (value) => {
        player.setSeek(value[0]);
    };

    const handleSpeedChange = () => {
        const speeds = [1, 1.25, 1.5, 2, 0.5, 0.75];
        const currentSpeedIndex = speeds.indexOf(speed);
        const nextSpeed = speeds[(currentSpeedIndex + 1) % speeds.length];
        player.setPlaybackSpeed(nextSpeed);
    }

    // TODO: Implement Zoom/Pan controls
    const handleZoomIn = () => {};
    const handleZoomOut = () => {};
    const handleReset = () => {};

    // We'll use a flex container to group controls
    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-4">
                {/* Group 1: Playback */}
                <div className="flex items-center gap-2">
                    <Button size="icon" onClick={isPlaying ? player.pause : player.play}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" onClick={player.stop} variant="outline">
                        <Square className="w-4 h-4" />
                    </Button>
                    {/* Fixed speed button from earlier */}
                    <Button onClick={handleSpeedChange} variant="outline">
                        <FastForward className="w-4 h-4" />
                        <span className="text-xs">{speed}x</span>
                    </Button>
                </div>
                
                {/* Separator */}
                <Separator orientation="vertical" className="h-9" />

                {/* Group 2: Scrubber */}
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
                    />
                    <span className="text-sm text-muted-foreground w-12 text-left">
                        {duration.toFixed(2)}s
                    </span>
                </div>
                
                {/* Separator */}
                <Separator orientation="vertical" className="h-9" />

                {/* Group 3: View Controls */}
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={handleZoomIn}><ZoomIn className="w-4 h-4" /></Button>
                    <Button size="icon" variant="outline" onClick={handleZoomOut}><ZoomOut className="w-4 h-4" /></Button>
                    <Button size="icon" variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4" /></Button>
                </div>
            </div>
        </div>
    );
};