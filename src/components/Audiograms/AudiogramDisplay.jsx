import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AudiogramPlot } from './AudiogramPlot'; // We will create this next
import { AnimatePresence, motion } from 'framer-motion';

export const AudiogramDisplay = () => {
    // This component is controlled by the new "showAudiogram" state
    const { showAudiogram } = useSignal();

    return (
        <AnimatePresence>
            {showAudiogram && (
                <motion.div
                    className="h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};