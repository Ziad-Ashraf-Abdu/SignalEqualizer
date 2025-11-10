import React, { createContext, useContext, useState } from 'react';

// Create a global audio context
const GlobalAudioContext = new (window.AudioContext || window.webkitAudioContext)();

const SignalContext = createContext();

export const useSignal = () => useContext(SignalContext);

export const SignalProvider = ({ children }) => {
    // Raw signal data
    const [originalSignal, setOriginalSignal] = useState(null); // AudioBuffer
    const [processedSignal, setProcessedSignal] = useState(null); // AudioBuffer

    // FFT and Spectrogram data
    const [originalFFT, setOriginalFFT] = useState(null);
    const [processedFFT, setProcessedFFT] = useState(null);
    const [originalSpectrogram, setOriginalSpectrogram] = useState(null);
    const [processedSpectrogram, setProcessedSpectrogram] = useState(null);

    // EQ settings
    const [mode, setMode] = useState('generic'); // 'generic', 'music', 'animals', 'voices'
    const [eqSettings, setEqSettings] = useState({ sliders: [] }); // Array of slider definitions

    // UI display state
    const [viewState, setViewState] = useState({ zoom: 1, pan: 0, currentTime: 0 });
    const [playbackState, setPlaybackState] = useState({ isPlaying: false, speed: 1 });
    const [displaySettings, setDisplaySettings] = useState({
        showSpectrogram: true,
        fftScale: 'linear', // This is for the *spectrogram* scale

        // --- ADD THIS LINE ---
        audiogramFreqScale: 'log', // 'log' or 'linear' for the FFT plot
        // ---------------------
    });

    // This state is fine, it controls visibility
    const [showAudiogram, setShowAudiogram] = useState(true);

    const value = {
        audioContext: GlobalAudioContext,
        originalSignal,
        setOriginalSignal,
        processedSignal,
        setProcessedSignal,
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