import React, { useRef, useEffect } from 'react';
import { useLinkedViewers } from '../../hooks/useLinkedViewers';

// A simple downsampling function for drawing large waveforms
function getDownsampledData(data, targetPoints) {
    if (!data || data.length === 0) return [];

    const dataLength = data.length;
    const sampleRate = Math.floor(dataLength / targetPoints);
    if (sampleRate < 2) {
        return Array.from(data).map((val, idx) => ({ x: idx, y: val }));
    }

    const sampledData = [];
    for (let i = 0; i < targetPoints; i++) {
        const start = i * sampleRate;
        const end = Math.min(start + sampleRate, dataLength);
        let min = data[start];
        let max = data[start];
        for (let j = start + 1; j < end; j++) {
            if (data[j] < min) min = data[j];
            if (data[j] > max) max = data[j];
        }
        // Store min/max for this bucket
        sampledData.push({ x: start, y: min });
        sampledData.push({ x: end, y: max });
    }
    return sampledData;
}

export const SignalPlot = ({ audioBuffer, isInput }) => {
    const canvasRef = useRef(null);
    const { currentTime, zoom, pan } = useLinkedViewers(); // Linked state
    const dataCache = useRef(null);

    useEffect(() => {
        // Cache the downsampled data when buffer changes
        if (audioBuffer) {
            const channelData = audioBuffer.getChannelData(0);
            dataCache.current = getDownsampledData(channelData, 2000); // Downsample to 2000 points
        } else {
            dataCache.current = null;
        }
    }, [audioBuffer]);

    useEffect(() => {
        // Drawing logic
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        if (!audioBuffer || !dataCache.current || dataCache.current.length === 0) {
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('No Signal Loaded', width / 2, height / 2);
            return;
        }

        const data = dataCache.current;
        const dataLength = audioBuffer.length;
        const halfHeight = height / 2;

        // Apply zoom and pan
        // This logic would be much more complex with real zooming/panning
        const startIndex = Math.floor(pan * dataLength);
        const visibleSamples = Math.floor(dataLength / zoom);
        const endIndex = Math.min(startIndex + visibleSamples, dataLength);

        ctx.strokeStyle = isInput ? '#a0a0a0' : '#3b82f6'; // Muted vs. Primary
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const x = (point.x / dataLength) * width;
            const y = (point.y * halfHeight) + halfHeight;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw current time cursor
        if (audioBuffer.duration > 0) {
            const cursorX = (currentTime / audioBuffer.duration) * width;
            ctx.strokeStyle = '#f87171'; // Red
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cursorX, 0);
            ctx.lineTo(cursorX, height);
            ctx.stroke();
        }

    }, [audioBuffer, currentTime, zoom, pan, dataCache.current]);

    // TODO: Add wheel/drag handlers for zoom and pan
    // These handlers would call setZoom() and setPan() from useLinkedViewers

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full bg-muted/30 rounded-md"
        />
    );
};