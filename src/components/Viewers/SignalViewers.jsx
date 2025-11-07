import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { SignalPlot } from './SignalPlot';
// import { ViewerControls } from './ViewerControls'; // <-- REMOVE
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { useAudioPlayer } from '../../hooks/useAudioPlayer'; // <-- REMOVE

export const SignalViewers = () => {
    const { originalSignal, processedSignal } = useSignal();

    // The player hook is removed from here
    
    return (
        // The outer div and ViewerControls are removed.
        // The component now *is* the grid of plots.
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <Card className="flex flex-col">
                <CardHeader><CardTitle>Input Signal</CardTitle></CardHeader>
                <CardContent className="flex-1">
                    <SignalPlot audioBuffer={originalSignal} isInput={true} />
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader><CardTitle>Output Signal</CardTitle></CardHeader>
                <CardContent className="flex-1">
                    <SignalPlot audioBuffer={processedSignal} isInput={false} />
                </CardContent>
            </Card>
        </div>
    );
};