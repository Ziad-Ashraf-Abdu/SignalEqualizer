import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { SignalPlot } from './SignalPlot';
import { ViewerControls } from './ViewerControls';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

export const SignalViewers = () => {
    const { originalSignal, processedSignal } = useSignal();

    // The player hook controls the PROCESSED signal
    const player = useAudioPlayer(processedSignal);

    return (
        <div className="flex flex-col h-full gap-4">
            <ViewerControls player={player} />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
    );
};