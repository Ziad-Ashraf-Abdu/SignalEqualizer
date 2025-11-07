/*
 * This file contains the manual implementation of FFT, iFFT, and Spectrogram
 * as required. No external DSP libraries are used.
 *
 * The FFT/iFFT logic is implemented using a recursive Radix-2 Cooley-Tukey algorithm.
 */

/**
 * Pads a signal to the next power of 2.
 * @param {Float32Array} signal - The input signal.
 * @returns {Float32Array} - The padded signal.
 */
function padSignal(signal) {
    const n = signal.length;
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(n)));
    if (n === nextPowerOfTwo) {
        return signal;
    }
    const padded = new Float32Array(nextPowerOfTwo);
    padded.set(signal);
    return padded;
}

/**
 * Recursive FFT worker function (Cooley-Tukey).
 * This single function computes both forward and inverse FFT.
 * @param {Float32Array} complexSignal - Interleaved complex signal [re, im, re, im, ...]
 * @param {boolean} isInverse - If true, computes the inverse FFT (different twiddle sign).
 * @returns {Float32Array} - The transformed complex signal.
 */
function fftRecursive(complexSignal, isInverse = false) {
    const N = complexSignal.length / 2;

    // 1. Base case
    if (N <= 1) {
        return complexSignal;
    }

    // 2. Separate even and odd components
    const N_half = N / 2;
    const even = new Float32Array(N_half * 2);
    const odd = new Float32Array(N_half * 2);

    for (let k = 0; k < N_half; k++) {
        // Even index (k*2)
        even[k * 2] = complexSignal[(k * 2) * 2];
        even[k * 2 + 1] = complexSignal[(k * 2) * 2 + 1];
        // Odd index (k*2 + 1)
        odd[k * 2] = complexSignal[(k * 2 + 1) * 2];
        odd[k * 2 + 1] = complexSignal[(k * 2 + 1) * 2 + 1];
    }

    // 3. Recurse
    const evenFFT = fftRecursive(even, isInverse);
    const oddFFT = fftRecursive(odd, isInverse);

    // 4. Combine results (butterfly)
    const result = new Float32Array(N * 2);
    // Use -2 for forward FFT (e^-j...) and +2 for inverse FFT (e^+j...)
    const angleSign = isInverse ? 2 : -2;

    for (let k = 0; k < N_half; k++) {
        const angle = (angleSign * Math.PI * k) / N;
        const tw_re = Math.cos(angle); // Twiddle factor real part
        const tw_im = Math.sin(angle); // Twiddle factor imaginary part

        // t = twiddle * oddFFT[k] (Complex multiplication)
        const t_re = tw_re * oddFFT[k * 2] - tw_im * oddFFT[k * 2 + 1];
        const t_im = tw_re * oddFFT[k * 2 + 1] + tw_im * oddFFT[k * 2];

        const k_N_half = k + N_half;

        // result[k] = evenFFT[k] + t (Complex addition)
        result[k * 2] = evenFFT[k * 2] + t_re;
        result[k * 2 + 1] = evenFFT[k * 2 + 1] + t_im;

        // result[k + N/2] = evenFFT[k] - t (Complex subtraction)
        result[k_N_half * 2] = evenFFT[k * 2] - t_re;
        result[k_N_half * 2 + 1] = evenFFT[k * 2 + 1] - t_im;
    }

    return result;
}

/**
 * Custom Fast Fourier Transform (FFT) wrapper.
 * @param {Float32Array} signal - The real input signal.
 * @returns {Float32Array} - Complex FFT result as [re1, im1, re2, im2, ...].
 */
export function fft(signal) {
    const paddedSignal = padSignal(signal);
    const N = paddedSignal.length;

    // Create complex array [re1, im1, re2, im2, ...]
    const complexSignal = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
        complexSignal[i * 2] = paddedSignal[i];
        // complexSignal[i * 2 + 1] is already 0 by default
    }

    // Run recursive FFT
    return fftRecursive(complexSignal, false);
}

/**
 * Custom Inverse Fast Fourier Transform (iFFT).
 * @param {Float32Array} complexSignal - Complex FFT data [re1, im1, ...].
 * @returns {Float32Array} - The real reconstructed signal.
 */
export function ifft(complexSignal) {
    const N2 = complexSignal.length;
    const N = N2 / 2;

    // Run inverse recursive FFT
    const inverseResult = fftRecursive(complexSignal, true);

    // Extract the real part and scale by 1/N
    const realSignal = new Float32Array(N);
    for (let i = 0; i < N; i++) {
        realSignal[i] = inverseResult[i * 2] / N;
    }

    return realSignal;
}
/**
 * Applies a Hann window to a signal chunk.
 * @param {Float32Array} chunk - The signal chunk.
 * @returns {Float32Array} - The windowed chunk.
 */
function applyHannWindow(chunk) {
    const N = chunk.length;
    const windowed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
        windowed[i] = chunk[i] * (0.5 * (1 - Math.cos((2 * Math.PI * i) / (N - 1))));
    }
    return windowed;
}

/**
 * Custom Spectrogram Generator.
 * @param {Float32Array} signal - The input signal.
 * @param {number} windowSize - The size of each FFT window (e.g., 2048).
 * @param {number} hopSize - The step size between windows (e.g., 512).
 * @returns {Array<Float32Array>} - An array of magnitude arrays (the columns of the spectrogram).
 */
export function createSpectrogram(signal, windowSize = 2048, hopSize = 512) {
    const spectrogram = [];
    // fftSize is handled by the padSignal function inside fft()

    for (let i = 0; i + windowSize <= signal.length; i += hopSize) {
        // 1. Get chunk
        const chunk = signal.slice(i, i + windowSize);

        // 2. Apply window
        const windowedChunk = applyHannWindow(chunk);

        // 3. FFT
        // The fft function will pad the windowed chunk to the next power of two
        const complexFFT = fft(windowedChunk);
        const fftSize = complexFFT.length / 2;

        // 4. Get magnitude
        const numBins = fftSize / 2 + 1;
        const magnitudes = new Float32Array(numBins);
        for (let k = 0; k < numBins; k++) {
            const re = complexFFT[k * 2];
            const im = complexFFT[k * 2 + 1];
            magnitudes[k] = Math.sqrt(re * re + im * im);
        }

        spectrogram.push(magnitudes);
    }
    return spectrogram;
}