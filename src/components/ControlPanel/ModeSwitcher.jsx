import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { loadSettingsFile } from '../../lib/settingsManager';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
// Import icons
import { SlidersHorizontal, Music, Dog, Mic } from 'lucide-react';

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

    // Helper to render items with icons
    const renderSelectItem = (value, icon, label) => (
        <SelectItem value={value}>
            <div className="flex items-center gap-2">
                {icon}
                <span>{label}</span>
            </div>
        </SelectItem>
    );

    return (
        <Select value={mode} onValueChange={handleModeChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select Mode" />
            </SelectTrigger>
            <SelectContent>
                {renderSelectItem("generic", <SlidersHorizontal className="h-4 w-4" />, "Generic Mode")}
                {renderSelectItem("music", <Music className="h-4 w-4" />, "Musical Instruments")}
                {renderSelectItem("animals", <Dog className="h-4 w-4" />, "Animal Sounds")}
                {renderSelectItem("voices", <Mic className="h-4 w-4" />, "Human Voices")}
            </SelectContent>
        </Select>
    );
};