import { useState, useEffect, useRef, useCallback } from 'react';
import { useSignal } from '../context/SignalContext';

export const useAudioPlayer = () => {
    const {
        audioContext,
        originalSignal,
        processedSignal,
        serverOutputSignal,
        activeSource, // <-- Knows which signal is active
        playbackState,
        setPlaybackState,
        viewState,
        setViewState
    } = useSignal();

    const [activeBuffer, setActiveBuffer] = useState(null);
    const sourceNodeRef = useRef(null);
    const startTimeRef = useRef(0); // AudioContext's time when play started
    const startedAtRef = useRef(0); // The moment in audioContext.currentTime play began
    const animationFrameRef = useRef(null);

    // 1. Select the correct AudioBuffer based on the activeSource
    useEffect(() => {
        let buffer = null;
        if (activeSource === 'input') {
            buffer = originalSignal;
        } else if (activeSource === 'eq') {
            buffer = processedSignal;
        } else if (activeSource === 'server') {
            buffer = serverOutputSignal;
        }
        setActiveBuffer(buffer);

        // Stop playback when the source or buffer changes
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }
        cancelAnimationFrame(animationFrameRef.current);
        setPlaybackState(prev => ({ ...prev, isPlaying: false }));
        // Don't reset time to 0, just stop

    }, [activeSource, originalSignal, processedSignal, serverOutputSignal]);

    // 2. Update the "viewState.currentTime" 60 times/sec
    const updateTime = useCallback(() => {
        if (!playbackState.isPlaying) {
            cancelAnimationFrame(animationFrameRef.current);
            return;
        }

        const elapsed = (audioContext.currentTime - startedAtRef.current) * playbackState.speed;
        let newTime = startTimeRef.current + elapsed;

        if (activeBuffer && newTime >= activeBuffer.duration) {
            stop(false); // Stop but don't reset time
        } else {
            setViewState(prev => ({ ...prev, currentTime: newTime }));
            animationFrameRef.current = requestAnimationFrame(updateTime);
        }
    }, [
        playbackState.isPlaying,
        playbackState.speed,
        audioContext.currentTime,
        activeBuffer,
        setViewState,
        startedAtRef,
        startTimeRef
    ]);

    // 3. Main Playback Functions
    const play = () => {
        // Check if already playing or if there's no buffer to play
        if (playbackState.isPlaying || !activeBuffer) return;

        // Make sure context is running (for browser autoplay policies)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const source = audioContext.createBufferSource();
        source.buffer = activeBuffer;
        source.playbackRate.value = playbackState.speed;
        source.connect(audioContext.destination);

        // Determine the correct offset to start from
        const offset = viewState.currentTime >= activeBuffer.duration ? 0 : viewState.currentTime;

        source.start(0, offset);

        sourceNodeRef.current = source;
        startTimeRef.current = offset; // Store the time we started from
        startedAtRef.current = audioContext.currentTime; // Store *when* we started

        setPlaybackState(prev => ({ ...prev, isPlaying: true }));
        animationFrameRef.current = requestAnimationFrame(updateTime);

        source.onended = () => {
            // Check if this 'onended' was triggered by a pause/stop, or by the track finishing
            if (playbackState.isPlaying) {
                // This means it ended naturally
                stop(false); // Stop but don't reset time to 0
            }
        };
    };

    const pause = () => {
        if (!playbackState.isPlaying || !sourceNodeRef.current) return;

        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;

        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;

        // Save the exact time we paused
        const elapsed = (audioContext.currentTime - startedAtRef.current) * playbackState.speed;
        const newTime = startTimeRef.current + elapsed;

        setPlaybackState(prev => ({ ...prev, isPlaying: false }));
        // Set the final current time, clamped to duration
        if (activeBuffer) {
            setViewState(prev => ({ ...prev, currentTime: Math.min(newTime, activeBuffer.duration) }));
        }
    };

    const stop = (resetTime = true) => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }

        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;

        setPlaybackState(prev => ({ ...prev, isPlaying: false }));

        if (resetTime) {
            setViewState(prev => ({ ...prev, currentTime: 0 }));
        }
    };

    const setSeek = (time) => {
        if (!activeBuffer) return;

        const newTime = Math.max(0, Math.min(time, activeBuffer.duration));
        setViewState(prev => ({ ...prev, currentTime: newTime }));

        // If playing, restart at the new time
        if (playbackState.isPlaying) {
            // Stop the old node
            if (sourceNodeRef.current) {
                sourceNodeRef.current.onended = null; // Prevent onended from firing
                sourceNodeRef.current.stop();
                sourceNodeRef.current.disconnect();
                sourceNodeRef.current = null;
            }
            // Start the new one
            play();
        }
    };

    const setPlaybackSpeed = (speed) => {
        const wasPlaying = playbackState.isPlaying;
        if (wasPlaying) {
            pause(); // Pauses, saving the current time
        }
        setPlaybackState(prev => ({ ...prev, speed: speed }));
        if (wasPlaying) {
            play(); // Resumes from the saved time with the new speed
        }
    };

    // Cleanup
    useEffect(() => {
        // This is a good place to stop audio if the component unmounts
        return () => {
            if (sourceNodeRef.current) {
                sourceNodeRef.current.stop();
                sourceNodeRef.current.disconnect();
            }
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);


    return { play, pause, stop, setSeek, setPlaybackSpeed };
};