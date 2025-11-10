import React from 'react';

export const LoudnessSlider = ({ value, onChange, disabled }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Loudness Level:</label>
            <span className="text-sm font-mono text-muted-foreground">
        {value.toFixed(1)}x
      </span>
        </div>
        <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Mute</span>
            <span>Original</span>
            <span>Triple</span>
        </div>
    </div>
);