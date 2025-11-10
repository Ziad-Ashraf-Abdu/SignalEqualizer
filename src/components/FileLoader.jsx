import React, { useRef } from 'react';
import { useSignal } from '../context/SignalContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

// Accept the icon as a prop
export const FileLoader = ({ icon }) => {
    // --- 1. GET THE setAudioFile SETTER ---
    const { audioContext, setOriginalSignal, setAudioFile } = useSignal();

    // Create a ref to trigger the hidden input
    const inputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // --- 2. SET THE RAW FILE STATE (THIS IS THE FIX) ---
        // This is what ControlPanel is waiting for.
        setAudioFile(file);

        toast.info('Loading signal...');

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // This is for your visualizer
            setOriginalSignal(audioBuffer);

            toast.success('Signal loaded successfully!');
        } catch (error) {
            console.error('Error decoding audio data:', error);
            toast.error('Failed to load audio file.', {
                description: 'Please try a different file (e.g., .wav, .mp3).',
            });

            // If it fails, reset the file state
            setAudioFile(null);
        }

        // Reset the input value to allow loading the same file again
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    // Function to trigger the file input click
    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="flex items-center gap-2">
            {/* This is the new, visible button */}
            <Button onClick={handleClick} variant="outline">
                {icon} {/* Render the icon */}
                Load Signal
            </Button>
            {/* This input is now hidden */}
            <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                ref={inputRef}
                className="hidden" // Hides the default input
            />
        </div>
    );
};