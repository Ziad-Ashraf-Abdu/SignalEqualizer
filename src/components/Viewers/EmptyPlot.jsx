import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SignalZero } from 'lucide-react';

// A simple, reusable component to show when no data is loaded
export const EmptyPlot = () => {
    return (
        <Card className="h-full">
            <CardContent className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <SignalZero className="w-20 h-20" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">No Signal Loaded</h3>
                    <p>Use the "Load Signal" button to get started.</p>
                </div>
            </CardContent>
        </Card>
    );
};