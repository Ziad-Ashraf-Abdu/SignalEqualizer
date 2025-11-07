import React, { useRef, useEffect } from 'react';

// Simple color map for spectrogram
function getSpectrogramColor(value) {
    // Simple grayscale, normalized
    const normalizedValue = Math.min(Math.max(value, 0), 1);
    const intensity = Math.floor(normalizedValue * 255);
    return `rgb(${intensity}, ${intensity}, ${intensity})`;
}

export const SpectrogramPlot = ({ data }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data || data.length === 0) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        const numTimeBins = data.length;
        const numFreqBins = data[0].length;

        const colWidth = width / numTimeBins;
        const rowHeight = height / numFreqBins;

        // Find max magnitude for normalization (a simple way)
        let maxMag = 0;
        for (let t = 0; t < numTimeBins; t++) {
            for (let f = 0; f < numFreqBins; f++) {
                if (data[t][f] > maxMag) maxMag = data[t][f];
            }
        }

        // Convert to log scale (dB) for better visualization
        const maxLogMag = Math.log10(maxMag);
        const minLogMag = Math.log10(maxMag / 1000); // 60dB range

        ctx.clearRect(0, 0, width, height);

        for (let t = 0; t < numTimeBins; t++) {
            for (let f = 0; f < numFreqBins; f++) {
                const mag = data[t][f];
                const logMag = Math.log10(mag);

                // Normalize between 0 and 1
                const normValue = (logMag - minLogMag) / (maxLogMag - minLogMag);

                ctx.fillStyle = getSpectrogramColor(normValue);

                // Draw from top (high freq) to bottom (low freq)
                const x = t * colWidth;
                const y = height - (f * rowHeight) - rowHeight;

                ctx.fillRect(x, y, colWidth + 1, rowHeight + 1); // +1 to avoid gaps
            }
        }

        // TODO: Add Audiogram scale logic
        // This would involve re-mapping the Y-axis (f) to a logarithmic scale
        // which is a complex canvas transformation.

    }, [data]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full bg-black rounded-md"
        />
    );
};