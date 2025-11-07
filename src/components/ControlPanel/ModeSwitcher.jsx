import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { loadSettingsFile } from '../../lib/settingsManager';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

export const ModeSwitcher = () => {
    const { mode, setMode, setEqSettings } = useSignal();

    const handleModeChange = async (newMode) => {
        setMode(newMode);
        if (newMode === 'generic') {
            // Reset to default generic state
            setEqSettings({
                mode: 'generic',
                sliders: [
                    // Add a default first band for generic
                    { id: crypto.randomUUID(), label: 'Band 1', bands: [{ freq: 1000, width: 500 }], scale: 1 },
                ],
            });
        } else {
            // Load settings file for custom modes
            toast.info(`Loading ${newMode} mode...`);
            const settings = await loadSettingsFile(newMode);
            setEqSettings(settings);
        }
    };

    return (
        <Select value={mode} onValueChange={handleModeChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select Mode" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="generic">Generic Mode</SelectItem>
                <SelectItem value="music">Musical Instruments</SelectItem>
                <SelectItem value="animals">Animal Sounds</SelectItem>
                <SelectItem value="voices">Human Voices</SelectItem>
            </SelectContent>
        </Select>
    );
};