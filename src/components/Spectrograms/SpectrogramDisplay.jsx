import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SpectrogramPlot } from './SpectrogramPlot';
import { AnimatePresence, motion } from 'framer-motion';

export const SpectrogramDisplay = () => {
    const { originalSpectrogram, processedSpectrogram, displaySettings } = useSignal();

    return (
        <AnimatePresence>
            {displaySettings.showSpectrogram && (
                <motion.div
                    className="h-full"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: '100%' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};