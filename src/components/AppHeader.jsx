import React from 'react';
import { FileLoader } from './FileLoader';
import { Music } from 'lucide-react';

export const AppHeader = () => {
    return (
        <header className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-2">
                <Music className="text-primary" />
                <h1 className="text-xl font-bold">Signal Equalizer</h1>
            </div>
            <FileLoader />
        </header>
    );
};