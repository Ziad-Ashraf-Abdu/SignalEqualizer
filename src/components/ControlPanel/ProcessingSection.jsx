import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { ClassifierSelect } from './ClassifierSelect';
import { LoudnessSlider } from './LoudnessSlider';

export const ProcessingSection = ({
                                      title,
                                      Icon,
                                      isOnline,
                                      description,
                                      classifier,
                                      setClassifier,
                                      loudness,
                                      setLoudness,
                                      options,
                                      onProcess,
                                      isProcessing,
                                      audioFile,
                                      offlineWarning,
                                  }) => {

    const statusColor = isOnline ? 'green' : 'red';
    const statusText = isOnline ? 'Online' : 'Offline';

    return (
        <AccordionItem value={title}>
            <AccordionTrigger>
                <div className="flex items-center gap-2 w-full">
                    <Icon className="w-4 h-4" />
                    <span>{title}</span>
                    {isOnline ? (
                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 ml-auto" />
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4 p-2">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">{description}</p>
                        <span
                            className={`px-2 py-0.5 rounded text-xs font-medium bg-${statusColor}-500/20 text-${statusColor}-600`}
                        >
              {statusText}
            </span>
                    </div>

                    <ClassifierSelect
                        label="Stem to Adjust:"
                        value={classifier}
                        onChange={setClassifier}
                        options={options}
                        disabled={isProcessing}
                    />

                    <LoudnessSlider
                        value={loudness}
                        onChange={setLoudness}
                        disabled={isProcessing}
                    />

                    <button
                        onClick={onProcess}
                        disabled={!audioFile || isProcessing || !isOnline}
                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        {isProcessing ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                        ) : (
                            <><Icon className="w-4 h-4" /> Process with {title}</>
                        )}
                    </button>

                    {!isOnline && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div className="text-xs">
                                <p className="font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                                    Server Offline
                                </p>
                                <p className="text-yellow-600/80 dark:text-yellow-400/80">
                                    {offlineWarning}
                                </p>
                            </div>
                        </div>
                    )}

                    {!audioFile && (
                        <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Load an audio file using the "Load Signal" button in the header
                            </p>
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};