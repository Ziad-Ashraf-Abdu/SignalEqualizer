import React from 'react';
import { FileLoader } from './FileLoader';
// Import the 'Upload' icon
import { Music, Upload } from 'lucide-react';

export const AppHeader = () => {
    return (
        <header className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-2">
                <Music className="text-primary" />
                <h1 className="text-xl font-bold">Signal Equalizer</h1>
            </div>
            {/* Pass the icon as a prop */}
            <FileLoader icon={<Upload className="w-4 h-4" />} />
        </header>
    );
};