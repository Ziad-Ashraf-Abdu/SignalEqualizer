import { useState, useRef, useEffect } from 'react';
import { useSignal } from '../context/SignalContext';

/**
 * Manages audio playback for a given AudioBuffer.
 * @param {AudioBuffer} audioBuffer - The buffer to play.
 */
export const useAudioPlayer = (audioBuffer) => {
    const { audioContext, viewState, setViewState, playbackState, setPlaybackState } = useSignal();

    const sourceNode = useRef(null);
    const animationFrameRef = useRef(null);
    const startTimeRef = useRef(0); // AudioContext's time when play started
    const pauseTimeRef = useRef(0); // Local time (in seconds) where pause occurred

    const { isPlaying, speed } = playbackState;

    // --- FIX 1: Create a ref to track the "isPlaying" state ---
    // This ref will be in sync with state but won't be stale in callbacks.
    const isPlayingRef = useRef(isPlaying);
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);
    // -----------------------------------------------------------

    const updateCurrentTime = () => {
        // --- FIX 2: Remove the stale `isPlaying` check ---
        // The loop is now controlled *only* by cancelAnimationFrame.
        if (!audioBuffer) {
            return;
        }
        // ------------------------------------------------

        const elapsedTime = (audioContext.currentTime - startTimeRef.current) * speed;
        let newTime = pauseTimeRef.current + elapsedTime;

        if (newTime >= audioBuffer.duration) {
            stop(); // This will stop the loop and reset time
        } else {
            setViewState(prev => ({ ...prev, currentTime: newTime }));
            animationFrameRef.current = requestAnimationFrame(updateCurrentTime); // Continue loop
        }
    };

    const play = () => {
        // Use the ref to check if already playing
        if (isPlayingRef.current || !audioBuffer) return;

        sourceNode.current = audioContext.createBufferSource();
        sourceNode.current.buffer = audioBuffer;
        sourceNode.current.playbackRate.value = speed;
        sourceNode.current.connect(audioContext.destination);

        // Resume from pauseTime or start from 0
        const offset = viewState.currentTime % audioBuffer.duration;
        pauseTimeRef.current = offset;
        startTimeRef.current = audioContext.currentTime;

        sourceNode.current.start(0, offset);

        sourceNode.current.onended = () => {
            // --- FIX 3: Use the ref in the `onended` handler ---
            // This ensures stop() is called correctly when the track finishes.
            if (isPlayingRef.current) {
                stop();
            }
            // ----------------------------------------------------
        };

        setPlaybackState(prev => ({ ...prev, isPlaying: true }));
        animationFrameRef.current = requestAnimationFrame(updateCurrentTime); // Start loop
    };

    const pause = () => {
        // Use the ref to check if it's currently playing
        if (!isPlayingRef.current || !sourceNode.current) return;

        cancelAnimationFrame(animationFrameRef.current);
        sourceNode.current.stop();
        sourceNode.current = null;

        // Save the exact time we paused
        const elapsedTime = (audioContext.currentTime - startTimeRef.current) * speed;
        const newTime = pauseTimeRef.current + elapsedTime;
        setViewState(prev => ({...prev, currentTime: newTime}));

        setPlaybackState(prev => ({ ...prev, isPlaying: false }));
    };

    const stop = () => {
        if (sourceNode.current) {
            sourceNode.current.stop();
            sourceNode.current = null;
        }
        cancelAnimationFrame(animationFrameRef.current);
        setPlaybackState(prev => ({ ...prev, isPlaying: false }));
        setViewState(prev => ({ ...prev, currentTime: 0 })); // This is the reset
        pauseTimeRef.current = 0;
    };

    const setPlaybackSpeed = (newSpeed) => {
        // Use the ref to check state
        const wasPlaying = isPlayingRef.current;
        if (wasPlaying) pause();
        setPlaybackState(prev => ({ ...prev, speed: newSpeed }));
        if (wasPlaying) play();
    };

    const setSeek = (newTime) => {
        // Use the ref to check state
        const wasPlaying = isPlayingRef.current;
        if (wasPlaying) pause();
        setViewState(prev => ({ ...prev, currentTime: newTime }));
        if (wasPlaying) play();
    }

    // Cleanup
    useEffect(() => {
        return () => {
            if (sourceNode.current) sourceNode.current.stop();
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return { play, pause, stop, setPlaybackSpeed, setSeek };
};