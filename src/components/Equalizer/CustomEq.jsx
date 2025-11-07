import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';

export const CustomEq = ({ settings }) => {
    const { eqSettings, setEqSettings } = useSignal();

    const handleSliderChange = (id, newValue) => {
        const newSliders = eqSettings.sliders.map((slider) =>
            slider.id === id ? { ...slider, scale: newValue[0] } : slider
        );
        setEqSettings({ ...eqSettings, sliders: newSliders });
    };

    return (
        <div className="space-y-6">
            {settings.sliders.map((slider) => (
                <div key={slider.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor={slider.id}>{slider.label}</Label>
                        <span className="text-sm text-muted-foreground">{slider.scale.toFixed(2)}x</span>
                    </div>
                    <Slider
                        id={slider.id}
                        min={0}
                        max={2}
                        step={0.05}
                        value={[slider.scale]}
                        onValueChange={(value) => handleSliderChange(slider.id, value)}
                    />
                </div>
            ))}
        </div>
    );
};