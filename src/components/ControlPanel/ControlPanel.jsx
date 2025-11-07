import React from 'react';
import { Equalizer } from '../Equalizer/Equalizer';
import { ModeSwitcher } from './ModeSwitcher';
import { DisplayOptions } from './DisplayOptions';
import { Separator } from '../ui/separator';
// Import the new Accordion components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const ControlPanel = () => {
    return (
        // We set type="multiple" and give all items a default value
        // so they are all open by default.
        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Controls</AccordionTrigger>
                <AccordionContent>
                    <ModeSwitcher />
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
                <AccordionTrigger>Equalizer</AccordionTrigger>
                <AccordionContent>
                    <Equalizer />
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
                <AccordionTrigger>Display Options</AccordionTrigger>
                <AccordionContent>
                    <DisplayOptions />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};