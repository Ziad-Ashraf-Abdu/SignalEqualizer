import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { SignalPlot } from './SignalPlot';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const SignalViewers = () => {
    // --- 1. Get the new signal from context ---
    const { originalSignal, processedSignal, serverOutputSignal } = useSignal();

    return (
        // --- 2. Change grid to 3 columns ---
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <Card className="flex flex-col">
                <CardHeader><CardTitle>Input Signal</CardTitle></CardHeader>
                <CardContent className="flex-1">
                    <SignalPlot audioBuffer={originalSignal} isInput={true} />
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader><CardTitle>Output Signal (EQ)</CardTitle></CardHeader>
                <CardContent className="flex-1">
                    <SignalPlot audioBuffer={processedSignal} isInput={false} />
                </CardContent>
            </Card>
            {/* --- 3. Add the new viewer panel --- */}
            <Card className="flex flex-col">
                <CardHeader><CardTitle>Server Output</CardTitle></CardHeader>
                <CardContent className="flex-1">
                    <SignalPlot audioBuffer={serverOutputSignal} isInput={false} />
                </CardContent>
            </Card>
        </div>
    );
};