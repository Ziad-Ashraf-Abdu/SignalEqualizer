import React, { useState } from 'react';
import { Equalizer } from '../Equalizer/Equalizer';
import { ModeSwitcher } from './ModeSwitcher';
import { DisplayOptions } from './DisplayOptions';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Music, Bird } from 'lucide-react';
import { useSignal } from '../../context/SignalContext';

// Import the new components and hook
import { SPLEETER_URL, ANIMAL_URL, SPLEETER_STEMS, ANIMAL_CLASSES } from '@/constants/serverConfig.js';
import { useAudioProcessing } from '@/hooks/useAudioProcessing.js';
import { ProcessingSection } from './ProcessingSection';

export const ControlPanel = () => {
    const { audioFile } = useSignal();

    // --- All server logic is now in this hook ---
    const {
        isProcessing,
        processingStatus,
        serversOnline,
        processAudio,
    } = useAudioProcessing(audioFile);

    // --- UI-specific state remains in the component ---
    const [spleeterClassifier, setSpleeterClassifier] = useState('vocals');
    const [spleeterLoudness, setSpleeterLoudness] = useState(1.0);
    const [animalClassifier, setAnimalClassifier] = useState('duck');
    const [animalLoudness, setAnimalLoudness] = useState(1.0);

    // --- Create handler functions to pass to the processing hook ---
    const handleSpleeterProcess = () => {
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('classifier', spleeterClassifier);
        formData.append('loudness', spleeterLoudness.toString());

        processAudio(
            `${SPLEETER_URL}/mix`,
            formData,
            `spleeter_${spleeterClassifier}_${spleeterLoudness}x.wav`,
            'Spleeter'
        );
    };

    const handleAnimalProcess = () => {
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('classifier', animalClassifier);
        formData.append('loudness', animalLoudness.toString());

        processAudio(
            `${ANIMAL_URL}/mix`,
            formData,
            `animal_${animalClassifier}_${animalLoudness}x.wav`,
            'Animal Classifier'
        );
    };

    return (
        <div className="space-y-4">
            <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5']} className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Controls</AccordionTrigger>
                    <AccordionContent>
                        <ModeSwitcher />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>Equalizer</AccordionTrigger>
                    <AccordionContent>
                        <Equalizer />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>Display Options</AccordionTrigger>
                    <AccordionContent>
                        <DisplayOptions />
                    </AccordionContent>
                </AccordionItem>

                {/* --- Spleeter Section (Now a reusable component) --- */}
                <ProcessingSection
                    title="Spleeter Processing"
                    Icon={Music}
                    isOnline={serversOnline.spleeter}
                    description="Separate and adjust music stems"
                    classifier={spleeterClassifier}
                    setClassifier={setSpleeterClassifier}
                    loudness={spleeterLoudness}
                    setLoudness={setSpleeterLoudness}
                    options={SPLEETER_STEMS}
                    onProcess={handleSpleeterProcess}
                    isProcessing={isProcessing}
                    audioFile={audioFile}
                    offlineWarning={<code className="bg-yellow-500/20 px-1 py-0.5 rounded">python separate_audio.py</code>}
                />

                {/* --- Animal Section (The *same* reusable component) --- */}
                <ProcessingSection
                    title="Animal Sound Processing"
                    Icon={Bird}
                    isOnline={serversOnline.animal}
                    description="Detect and adjust animal sounds"
                    classifier={animalClassifier}
                    setClassifier={setAnimalClassifier}
                    loudness={animalLoudness}
                    setLoudness={setAnimalLoudness}
                    options={ANIMAL_CLASSES}
                    onProcess={handleAnimalProcess}
                    isProcessing={isProcessing}
                    audioFile={audioFile}
                    offlineWarning={<code className="bg-yellow-500/20 px-1 py-0.5 rounded">python animal_server.py</code>}
                />

            </Accordion>

            {/* Status Display - Outside accordion for better visibility */}
            {processingStatus && (
                <div className={`p-3 rounded-md border ${
                    processingStatus.startsWith('✓')
                        ? 'bg-green-500/10 border-green-500/20'
                        : processingStatus.startsWith('✗')
                            ? 'bg-red-500/10 border-red-500/20'
                            : 'bg-blue-500/10 border-blue-500/20'
                }`}>
                    <p className={`text-sm font-medium ${
                        processingStatus.startsWith('✓')
                            ? 'text-green-600 dark:text-green-400'
                            : processingStatus.startsWith('✗')
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-blue-600 dark:text-blue-400'
                    }`}>
                        {processingStatus}
                    </p>
                </div>
            )}
        </div>
    );
};