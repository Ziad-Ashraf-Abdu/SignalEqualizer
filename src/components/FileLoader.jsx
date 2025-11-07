import React from 'react';
import { useSignal } from '../context/SignalContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

export const FileLoader = () => {
    const { audioContext, setOriginalSignal } = useSignal();

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
    };

    return (
        <div className="flex items-center gap-2">
            <Label htmlFor="audio-file" className="sr-only">Load Signal</Label>
            <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
        </div>
    );
};