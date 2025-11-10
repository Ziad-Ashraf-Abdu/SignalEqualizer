import React from 'react';

export const ClassifierSelect = ({ label, value, onChange, options, disabled }) => (
    <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        >
            {options.map(option => (
                <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
            ))}
        </select>
    </div>
);