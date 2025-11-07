import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export const DisplayOptions = () => {
    const { displaySettings, setDisplaySettings } = useSignal();

    const toggleSpectrogram = (checked) => {
        setDisplaySettings((prev) => ({ ...prev, showSpectrogram: checked }));
    };

    const toggleFftScale = (checked) => {
        setDisplaySettings((prev) => ({ ...prev, fftScale: checked ? 'audiogram' : 'linear' }));
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
            <div className="flex items-center justify-between">
                <Label htmlFor="fft-scale">Audiogram Scale (FFT)</Label>
                <Switch
                    id="fft-scale"
                    checked={displaySettings.fftScale === 'audiogram'}
                    onCheckedChange={toggleFftScale}
                />
            </div>
        </div>
    );
};