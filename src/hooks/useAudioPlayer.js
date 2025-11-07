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

    const updateCurrentTime = () => {
        if (!isPlaying || !audioBuffer) return;

        const elapsedTime = (audioContext.currentTime - startTimeRef.current) * speed;
        let newTime = pauseTimeRef.current + elapsedTime;

        if (newTime >= audioBuffer.duration) {
            stop(); // Stop playback if ended
        } else {
            setViewState(prev => ({ ...prev, currentTime: newTime }));
            animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
        }
    };

    const play = () => {
        if (isPlaying || !audioBuffer) return;

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
            if (playbackState.isPlaying) { // Only reset if it wasn't a manual stop
                stop();
            }
        };

        setPlaybackState(prev => ({ ...prev, isPlaying: true }));
        animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
    };

    const pause = () => {
        if (!isPlaying || !sourceNode.current) return;

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
        setViewState(prev => ({ ...prev, currentTime: 0 }));
        pauseTimeRef.current = 0;
    };

    const setPlaybackSpeed = (newSpeed) => {
        const wasPlaying = isPlaying;
        if (wasPlaying) pause();
        setPlaybackState(prev => ({ ...prev, speed: newSpeed }));
        if (wasPlaying) play();
    };

    const setSeek = (newTime) => {
        const wasPlaying = isPlaying;
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