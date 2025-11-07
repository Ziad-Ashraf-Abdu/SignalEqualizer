import { useEffect } from 'react';
import { useSignal } from '../context/SignalContext';
import { fft, ifft, createSpectrogram } from '../lib/dsp';

/**
 * This hook manages all signal processing logic.
 * It listens for a new original signal or a change in EQ settings
 * and re-calculates the FFT, spectrogram, and processed signal.
 */
export const useSignalProcessor = () => {
    const {
        originalSignal,
        setOriginalSignal,
        setProcessedSignal,
        originalFFT,
        setOriginalFFT,
        setProcessedFFT,
        setOriginalSpectrogram,
        setProcessedSpectrogram,
        eqSettings,
        mode,
        audioContext,
    } = useSignal();

    // 1. Process a newly loaded original signal
    useEffect(() => {
        if (!originalSignal) return;

        // We process the first channel for simplicity
        const signalData = originalSignal.getChannelData(0);

        // Run initial FFT and Spectrogram
        const fftData = fft(signalData);
        const spectrogramData = createSpectrogram(signalData);

        setOriginalFFT(fftData);
        setProcessedFFT(fftData); // Start with processed = original
        setOriginalSpectrogram(spectrogramData);
        setProcessedSpectrogram(spectrogramData); // Start with processed = original
        setProcessedSignal(originalSignal); // Start with processed = original
    }, [originalSignal]);

    // 2. Re-process the signal when EQ settings change
    useEffect(() => {
        if (!originalFFT || !originalSignal) return;

        const N = originalFFT.length / 2; // FFT size
        const sampleRate = originalSignal.sampleRate;

        // Create a mutable copy of the original FFT data
        const modifiedFFT = new Float32Array(originalFFT);

        // Helper to get frequency bin index
        const freqToBin = (freq) => Math.round((freq / sampleRate) * N);

        // Apply each slider's bands
        eqSettings.sliders.forEach((slider) => {
            const scale = slider.scale;

            slider.bands.forEach((band) => {
                const centerBin = freqToBin(band.freq);
                const widthBins = freqToBin(band.width / 2);

                const startBin = Math.max(0, centerBin - widthBins);
                const endBin = Math.min(N / 2, centerBin + widthBins); // Only modify up to Nyquist

                for (let i = startBin; i <= endBin; i++) {
                    // Apply a simple triangular falloff from the center
                    const distance = Math.abs(i - centerBin);
                    const falloff = Math.max(0, 1 - distance / widthBins);
                    const effectiveScale = 1 + (scale - 1) * falloff;

                    // Modify real and imaginary parts
                    // Symmetrical modification for real signals
                    const symBin = N - i;

                    // Positive frequency
                    modifiedFFT[i * 2] *= effectiveScale;
                    modifiedFFT[i * 2 + 1] *= effectiveScale;

                    // Negative frequency (mirror)
                    if (i > 0 && i < N / 2) {
                        modifiedFFT[symBin * 2] *= effectiveScale;
                        modifiedFFT[symBin * 2 + 1] *= effectiveScale;
                    }
                }
            });
        });

        // Update the processed FFT state
        setProcessedFFT(modifiedFFT);

        // Run Inverse FFT
        const processedSignalData = ifft(modifiedFFT);

        // Create new AudioBuffer for the processed signal
        const newBuffer = audioContext.createBuffer(
            originalSignal.numberOfChannels,
            processedSignalData.length,
            originalSignal.sampleRate
        );

        // For now, copy mono processed data to all channels
        for (let i = 0; i < originalSignal.numberOfChannels; i++) {
            newBuffer.copyToChannel(processedSignalData, i);
        }

        setProcessedSignal(newBuffer);

        // Re-calculate the processed spectrogram
        const processedSpectrogramData = createSpectrogram(processedSignalData);
        setProcessedSpectrogram(processedSpectrogramData);

    }, [eqSettings, originalFFT]); // Re-run whenever settings or original FFT change
};