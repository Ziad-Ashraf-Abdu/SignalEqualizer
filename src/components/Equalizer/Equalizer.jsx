import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { GenericEq } from './GenericEq';
import { CustomEq } from './CustomEq';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalProcessor } from '@/hooks/useSignalProcessor';

export const Equalizer = () => {
    const { mode, eqSettings } = useSignal();

    // This hook triggers all the processing
    // It's placed here so it runs in a component that has access to the context
    useSignalProcessor();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4 capitalize">{mode} Mode</h2>
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {mode === 'generic' ? (
                        <GenericEq settings={eqSettings} />
                    ) : (
                        <CustomEq settings={eqSettings} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};