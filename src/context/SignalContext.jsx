import React, { createContext, useContext, useState } from 'react';

// Create a global audio context
const GlobalAudioContext = new (window.AudioContext || window.webkitAudioContext)();

const SignalContext = createContext();

export const useSignal = () => useContext(SignalContext);

export const SignalProvider = ({ children }) => {
    // Raw signal data
    const [originalSignal, setOriginalSignal] = useState(null); // AudioBuffer
    const [processedSignal, setProcessedSignal] = useState(null); // AudioBuffer
    const [serverOutputSignal, setServerOutputSignal] = useState(null); // AudioBuffer

    // Raw file for server
    const [audioFile, setAudioFile] = useState(null); // File object

    // --- ADD THIS ---
    // 'input', 'eq' (for processed), or 'server'
    const [activeSource, setActiveSource] = useState('input');

    // FFT and Spectrogram data
    const [originalFFT, setOriginalFFT] = useState(null);
    const [processedFFT, setProcessedFFT] = useState(null);
    const [originalSpectrogram, setOriginalSpectrogram] = useState(null);
    const [processedSpectrogram, setProcessedSpectrogram] = useState(null);

    // EQ settings
    const [mode, setMode] = useState('generic');
    const [eqSettings, setEqSettings] = useState({ sliders: [] });

    // UI display state
    const [viewState, setViewState] = useState({ zoom: 1, pan: 0, currentTime: 0 });
    const [playbackState, setPlaybackState] = useState({ isPlaying: false, speed: 1 });
    const [displaySettings, setDisplaySettings] = useState({
        showSpectrogram: true,
        fftScale: 'linear',
        audiogramFreqScale: 'log',
    });

    const [showAudiogram, setShowAudiogram] = useState(true);

    const value = {
        audioContext: GlobalAudioContext,
        originalSignal,
        setOriginalSignal,
        processedSignal,
        setProcessedSignal,
        serverOutputSignal,
        setServerOutputSignal,
        audioFile,
        setAudioFile,

        // --- ADD THESE ---
        activeSource,
        setActiveSource,

        originalFFT,
        setOriginalFFT,
        processedFFT,
        setProcessedFFT,
        originalSpectrogram,
        setOriginalSpectrogram,
        processedSpectrogram,
        setProcessedSpectrogram,
        mode,
        setMode,
        eqSettings,
        setEqSettings,
        viewState,
        setViewState,
        playbackState,
        setPlaybackState,
        displaySettings,
        setDisplaySettings,
        showAudiogram,
        setShowAudiogram,
    };

    return <SignalContext.Provider value={value}>{children}</SignalContext.Provider>;
};