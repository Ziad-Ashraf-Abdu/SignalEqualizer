import React from 'react';
import { AppHeader } from './components/AppHeader';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { SignalViewers } from './components/Viewers/SignalViewers';
import { SpectrogramDisplay } from './components/Spectrograms/SpectrogramDisplay';
// --- IMPORT THE NEW COMPONENT ---
import { AudiogramDisplay } from './components/Audiograms/AudiogramDisplay';
// ---------------------------------
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { motion } from 'framer-motion';

function App() {
    return (
        <div className="flex flex-col h-screen bg-background text-foreground dark">
            <AppHeader />
            <div className="flex-grow flex overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    {/* Main Content Area */}
                    <ResizablePanel defaultSize={70}>
                        <div className="h-full overflow-y-auto p-4 flex flex-col gap-4">
                            {/* Signal Viewers */}
                            <motion.div
                                className="h-[75vh]" // Fixed height
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <SignalViewers />
                            </motion.div>
                            
                            {/* --- ADD THE NEW AUDIOGRAM DISPLAY --- */}
                            <motion.div
                                className="h-[75vh]" // Fixed height
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <AudiogramDisplay />
                            </motion.div>
                            {/* -------------------------------------- */}

                            {/* Spectrograms */}
                            <motion.div
                                className="h-[75vh]" // Fixed height
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <SpectrogramDisplay />
                            </motion.div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Control Panel Sidebar */}
                    <ResizablePanel defaultSize={30} minSize={25}>
                        <motion.div
                            className="h-full p-4 overflow-y-auto"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ControlPanel />
                        </motion.div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

export default App;