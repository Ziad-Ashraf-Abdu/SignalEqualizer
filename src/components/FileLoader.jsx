import React, { useRef } from 'react';
import { useSignal } from '../context/SignalContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

// Accept the icon as a prop
export const FileLoader = ({ icon }) => {
    const { audioContext, setOriginalSignal } = useSignal();
    // Create a ref to trigger the hidden input
    const inputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        toast.info('Loading signal...');

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            setOriginalSignal(audioBuffer);
            toast.success('Signal loaded successfully!');
        } catch (error) {
            console.error('Error decoding audio data:', error);
            toast.error('Failed to load audio file.', {
                description: 'Please try a different file (e.g., .wav, .mp3).',
            });
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