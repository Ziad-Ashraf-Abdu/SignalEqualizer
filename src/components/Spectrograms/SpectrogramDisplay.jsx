import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SpectrogramPlot } from './SpectrogramPlot';
// Remove AnimatePresence and motion
// import { AnimatePresence, motion } from 'framer-motion';

export const SpectrogramDisplay = () => {
    const { originalSpectrogram, processedSpectrogram, displaySettings } = useSignal();

    // The parent (App.jsx) now handles showing/hiding this component.
    if (!displaySettings.showSpectrogram) return null;

    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col">
                <CardHeader><CardTitle>Input Spectrogram</CardTitle></CardHeader>
                <CardContent className="flex-1">
                    <SpectrogramPlot data={originalSpectrogram} />
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader><CardTitle>Output Spectrogram</CardTitle></CardHeader>
                <CardContent className="flex-1">
                    <SpectrogramPlot data={processedSpectrogram} />
                </CardContent>
            </Card>
        </div>
    );
};