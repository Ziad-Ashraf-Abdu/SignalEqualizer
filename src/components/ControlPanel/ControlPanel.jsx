import React from 'react';
import { Equalizer } from '../Equalizer/Equalizer';
import { ModeSwitcher } from './ModeSwitcher';
import { DisplayOptions } from './DisplayOptions';
import { Separator } from '../ui/separator';

export const ControlPanel = () => {
    return (
        <div className="flex flex-col gap-6 h-full">
            <div>
                <h2 className="text-lg font-semibold mb-2">Controls</h2>
                <ModeSwitcher />
            </div>
            <Separator />
            <div className="flex-1 overflow-y-auto pr-2">
                <Equalizer />
            </div>
            <Separator />
            <div>
                <h2 className="text-lg font-semibold mb-2">Display Options</h2>
                <DisplayOptions />
            </div>
        </div>
    );
};