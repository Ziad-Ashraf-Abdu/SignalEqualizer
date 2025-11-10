import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AudiogramPlot } from './AudiogramPlot';
import { Button } from '../ui/button';
export const AudiogramDisplay = () => {
    const { showAudiogram, displaySettings, setDisplaySettings } = useSignal();

    if (!showAudiogram) return null;

    const scaleType = displaySettings.audiogramFreqScale;

    const toggleScale = () => {
        setDisplaySettings(prev => ({
            ...prev,
            audiogramFreqScale: prev.audiogramFreqScale === 'log' ? 'linear' : 'log'
        }));
    };

    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Input Audiogram (FFT)</CardTitle>
                        {/* --- ADD THIS BUTTON --- */}
                        <Button variant="outline" size="sm" onClick={toggleScale}>
                            {scaleType === 'log' ? 'Linear' : 'Log'} Scale
                        </Button>
                        {/* --------------------- */}
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    {/* --- PASS THE PROP --- */}
                    <AudiogramPlot isInput={true} scaleType={scaleType} />
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Output Audiogram (FFT)</CardTitle>
                    {/* We only need one button, it controls both */}
                </CardHeader>
                <CardContent className="flex-1">
                    {/* --- PASS THE PROP --- */}
                    <AudiogramPlot isInput={false} scaleType={scaleType} />
                </CardContent>
            </Card>
        </div>
    );
};