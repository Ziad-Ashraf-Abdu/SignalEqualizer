import { useSignal } from '../context/SignalContext';

/**
 * Hook to manage the shared state of linked viewers (zoom, pan, time).
 */
export const useLinkedViewers = () => {
    const { viewState, setViewState } = useSignal();

    const setZoom = (zoomLevel) => {
        setViewState((prev) => ({ ...prev, zoom: Math.max(1, zoomLevel) }));
    };

    const setPan = (panOffset) => {
        setViewState((prev) => ({ ...prev, pan: panOffset }));
    };

    const resetView = () => {
        setViewState((prev) => ({ ...prev, zoom: 1, pan: 0 }));
    };

    // This function is called by the audio player hook
    const setCurrentTime = (time) => {
        setViewState((prev) => ({ ...prev, currentTime: time }));
    };

    return {
        ...viewState,
        setZoom,
        setPan,
        resetView,
        setCurrentTime,
    };
};