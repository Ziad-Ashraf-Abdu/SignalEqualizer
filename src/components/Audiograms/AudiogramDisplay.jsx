import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AudiogramPlot } from './AudiogramPlot'; // We will create this next

export const AudiogramDisplay = () => {
    // This component is rendered by App.jsx,
    // so it doesn't need its own conditional logic.
    const { showAudiogram } = useSignal();
    
    // We still check the flag, just in case.
    if (!showAudiogram) return null;

    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col">
                <CardHeader><CardTitle>Input Audiogram (FFT)</CardTitle></CardHeader>
                <CardContent className="flex-1">
                    <AudiogramPlot isInput={true} />
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader><CardTitle>Output Audiogram (FFT)</CardTitle></CardHeader>
                <CardContent className="flex-1">
                    <AudiogramPlot isInput={false} />
                </CardContent>
            </Card>
        </div>
    );
};