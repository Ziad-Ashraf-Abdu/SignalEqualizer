import React from 'react';
import { AppHeader } from './components/AppHeader';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { SignalViewers } from './components/Viewers/SignalViewers';
import { SpectrogramDisplay } from './components/Spectrograms/SpectrogramDisplay';
import { AudiogramDisplay } from './components/Audiograms/AudiogramDisplay';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { motion, AnimatePresence } from 'framer-motion';
import { useSignal } from './context/SignalContext';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { ViewerControls } from './components/Viewers/ViewerControls';
import { Card } from '@/components/ui/card';
// Import the new EmptyPlot component
import { EmptyPlot } from './components/Viewers/EmptyPlot';

function App() {
    const { originalSignal, processedSignal, displaySettings, showAudiogram } = useSignal();
    const player = useAudioPlayer(processedSignal);

    return (
        <div className="flex flex-col h-screen bg-background text-foreground dark">
            <AppHeader />
            <div className="flex-grow flex overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    {/* Main Content Area */}
                    <ResizablePanel defaultSize={70} className="flex flex-col">
                        
                        {/* 1. Master Controls (non-scrolling) */}
                        {/* We only show controls if a signal is loaded */}
                        {originalSignal && (
                            <div className="p-4 pb-0">
                                <ViewerControls player={player} />
                            </div>
                        )}

                        {/* 2. Scrolling Area (for all graphs) */}
                        <div className="flex-1 h-0 overflow-y-auto p-4 flex flex-col gap-4">
                            {/* --- CHECK IF SIGNAL EXISTS --- */}
                            {!originalSignal ? (
                                // If NO signal, show the EmptyPlot
                                <EmptyPlot />
                            ) : (
                                // If signal EXISTS, show the graphs
                                <>
                                    {/* Signal Viewers Module (Always visible) */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Card className="h-[60vh] flex flex-col">
                                            <SignalViewers />
                                        </Card>
                                    </motion.div>
                                    
                                    <AnimatePresence>
                                        {/* Audiogram Display Module (Conditional) */}
                                        {showAudiogram && (
                                            <motion.div
                                                key="audiogram"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: '60vh' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <Card className="h-full flex flex-col">
                                                    <AudiogramDisplay />
                                                </Card>
                                            </motion.div>
                                        )}

                                        {/* Spectrograms Module (Conditional) */}
                                        {displaySettings.showSpectrogram && (
                                            <motion.div
                                                key="spectrogram"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: '60vh' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <Card className="h-full flex flex-col">
                                                    <SpectrogramDisplay />
                                                </Card>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                            {/* --- END CHECK --- */}
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Control Panel Sidebar */}
                    <ResizablePanel defaultSize={30} minSize={25}>
                        <Card className="h-[calc(100%-2rem)] m-4 mt-0 mr-0 overflow-hidden">
                            <motion.div
                                className="h-full p-4 overflow-y-auto"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ControlPanel />
                            </motion.div>
                        </Card>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

export default App;