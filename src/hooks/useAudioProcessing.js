import { useState, useEffect, useCallback } from 'react';
import { SPLEETER_URL, ANIMAL_URL } from '../constants/serverConfig';
import { useSignal } from '../context/SignalContext'; // Import the context hook

export const useAudioProcessing = () => {
    // Get all required state and setters from the context
    const {
        audioFile,
        audioContext,
        // --- CHANGE 1: Get the new setter ---
        setServerOutputSignal
    } = useSignal();

    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const [serversOnline, setServersOnline] = useState({
        spleeter: false,
        animal: false,
    });

    // --- Server Health Check (Unchanged) ---
    const checkServers = useCallback(async () => {
        const checkHealth = async (url) => {
            try {
                const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(2000) });
                return res.ok;
            } catch (e) {
                return false;
            }
        };
        const spleeterOk = await checkHealth(SPLEETER_URL);
        const animalOk = await checkHealth(ANIMAL_URL);
        setServersOnline({ spleeter: spleeterOk, animal: animalOk });
    }, []);

    useEffect(() => {
        checkServers();
        const interval = setInterval(checkServers, 30000);
        return () => clearInterval(interval);
    }, [checkServers]);

    // --- Process Audio Function (MODIFIED) ---
    const processAudio = async (url, formData, downloadName, processName) => {
        if (!audioFile) {
            alert('Please load an audio file first!');
            return;
        }

        setIsProcessing(true);
        setProcessingStatus(`Processing with ${processName}...`);
        // --- CHANGE 2: Clear the *server* output signal ---
        setServerOutputSignal(null);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Processing failed');
            }

            // --- NEW LOGIC: Decode and load into context ---
            setProcessingStatus(`✓ Server complete. Decoding audio...`);

            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();

            // Use the global AudioContext to decode the data
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // --- CHANGE 3: Set the *server* output signal in the context ---
            setServerOutputSignal(audioBuffer);

            setProcessingStatus(`✓ Processed signal loaded in server output viewer!`);
            // --- END NEW LOGIC ---

        } catch (error) {
            console.error(`${processName} error:`, error);
            setProcessingStatus(`✗ Error: ${error.message}`);
            // --- CHANGE 4: Clear *server* output on error ---
            setServerOutputSignal(null);
        } finally {
            setIsProcessing(false);
            // Keep the "success" message for a few seconds
            setTimeout(() => {
                if (!isProcessing) setProcessingStatus('');
            }, 5000);
        }
    };

    return {
        isProcessing,
        processingStatus,
        serversOnline,
        processAudio,
    };
};