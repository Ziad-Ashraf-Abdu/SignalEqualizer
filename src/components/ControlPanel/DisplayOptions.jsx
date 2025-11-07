import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export const DisplayOptions = () => {
    // Get the new audiogram state
    const { displaySettings, setDisplaySettings, showAudiogram, setShowAudiogram } = useSignal();

    const toggleSpectrogram = (checked) => {
        setDisplaySettings((prev) => ({ ...prev, showSpectrogram: checked }));
    };

    // --- RE-WIRE THIS FUNCTION ---
    const toggleAudiogram = (checked) => {
        setShowAudiogram(checked);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="show-spectrogram">Show Spectrograms</Label>
                <Switch
                    id="show-spectrogram"
                    checked={displaySettings.showSpectrogram}
                    onCheckedChange={toggleSpectrogram}
                />
            </div>
            {/* --- RE-WIRE THIS SWITCH --- */}
            <div className="flex items-center justify-between">
                <Label htmlFor="show-audiogram">Show Audiogram (FFT Plot)</Label>
                <Switch
                    id="show-audiogram"
                    checked={showAudiogram}
                    onCheckedChange={toggleAudiogram}
                />
            </div>
        </div>
    );
};