import React, { useRef, useEffect } from 'react';
import { useSignal } from '../../context/SignalContext';

// --- Constants for the plot ---
const MIN_DB = -90;
const MAX_DB = 0;
const MIN_FREQ_HZ = 20; // Used for log scale cutoff

// Helper to convert linear magnitude to dB
function magnitudeToDb(mag) {
    if (mag < 1e-9) return MIN_DB;
    const db = 20 * Math.log10(mag);
    return Math.max(MIN_DB, Math.min(MAX_DB, db)); // Clamp
}

// Helper to convert frequency to a LOG-scaled X-coordinate
function freqToX_Log(width, freq, maxLogFreq, minLogFreq) {
    if (freq < MIN_FREQ_HZ) return 0;
    const logRange = maxLogFreq - minLogFreq;
    const xNorm = (Math.log10(freq) - minLogFreq) / logRange;
    return xNorm * width;
}

// Helper to convert frequency to a LINEAR-scaled X-coordinate
function freqToX_Linear(width, freq, maxFreq) {
    if (freq < 0) return 0;
    return (freq / maxFreq) * width;
}

// Helper to convert dB to a Y-coordinate
function dbToY(height, db) {
    const dbRange = MAX_DB - MIN_DB;
    const yNorm = (db - MIN_DB) / dbRange;
    return height - (yNorm * height); // Inverted (0dB at top)
}

export const AudiogramPlot = ({ isInput, scaleType = 'log' }) => { // <-- New prop
    const canvasRef = useRef(null);
    const { originalFFT, processedFFT, originalSignal } = useSignal();

    const fftData = isInput ? originalFFT : processedFFT;
    const sampleRate = originalSignal?.sampleRate || 44100; // Default
    const nyquist = sampleRate / 2;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !fftData) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        const N = fftData.length / 2;
        const numBins = N / 2 + 1;

        ctx.clearRect(0, 0, width, height);

        // --- Draw Y-Axis Gridlines (dB) ---
        ctx.strokeStyle = '#333'; // Muted grid color
        ctx.fillStyle = '#666';
        ctx.font = '10px sans-serif';
        ctx.lineWidth = 1;

        for (let db = -80; db < 0; db += 20) {
            const y = dbToY(height, db);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
            ctx.fillText(`${db}dB`, 5, y - 5);
        }

        // --- Define X-axis functions based on scaleType ---
        let getX;
        let drawXGridlines;

        if (scaleType === 'log') {
            const maxLogFreq = Math.log10(nyquist);
            const minLogFreq = Math.log10(MIN_FREQ_HZ);

            getX = (freq) => freqToX_Log(width, freq, maxLogFreq, minLogFreq);

            drawXGridlines = () => {
                const freqLines = [100, 1000, 10000];
                freqLines.forEach(freq => {
                    if (freq < nyquist) {
                        const x = getX(freq);
                        ctx.beginPath();
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, height);
                        ctx.stroke();
                        ctx.fillText(`${freq < 1000 ? freq : freq / 1000 + 'k'}Hz`, x + 5, height - 10);
                    }
                });
            };

        } else { // 'linear'
            getX = (freq) => freqToX_Linear(width, freq, nyquist);

            drawXGridlines = () => {
                const freqLines = [];
                const step = 5000; // e.g., 5kHz, 10kHz, 15kHz...
                for (let freq = step; freq < nyquist; freq += step) {
                    freqLines.push(freq);
                }

                freqLines.forEach(freq => {
                    const x = getX(freq);
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                    ctx.stroke();
                    ctx.fillText(`${freq / 1000}kHz`, x + 5, height - 10);
                });
            };
        }

        // --- Draw X Gridlines ---
        drawXGridlines();

        // --- Draw the FFT Plot (Unified) ---
        ctx.strokeStyle = isInput ? '#a0a0a0' : '#3b82f6'; // Muted vs. Primary
        ctx.lineWidth = 2;
        ctx.beginPath();

        let firstPoint = true;
        for (let f = 0; f < numBins; f++) {
            const freq = (f / (numBins - 1)) * nyquist;

            // Only apply min freq cutoff for log scale
            if (scaleType === 'log' && freq < MIN_FREQ_HZ) {
                continue;
            }

            const re = fftData[f * 2];
            const im = fftData[f * 2 + 1];
            const mag = Math.sqrt(re * re + im * im);
            const db = magnitudeToDb(mag);

            const x = getX(freq);
            const y = dbToY(height, db);

            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

    }, [fftData, sampleRate, scaleType]); // <-- Added scaleType to dependency array

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full bg-muted/30 rounded-md"
        />
    );
};