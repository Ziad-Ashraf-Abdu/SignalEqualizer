import React from 'react';
import { useSignal } from '../../context/SignalContext';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GenericEq = () => {
    const { eqSettings, setEqSettings } = useSignal();

    const updateSlider = (id, field, value) => {
        const newSliders = eqSettings.sliders.map((slider) => {
            if (slider.id !== id) return slider;

            if (field === 'scale') {
                return { ...slider, scale: value };
            }
            // Assuming one band for generic mode for simplicity
            // A real generic mode would have band selection
            const newBands = [{ ...slider.bands[0], [field]: Number(value) }];
            return { ...slider, bands: newBands };
        });
        setEqSettings({ ...eqSettings, sliders: newSliders });
    };

    const addSlider = () => {
        const newSlider = {
            id: crypto.randomUUID(),
            label: `Band ${eqSettings.sliders.length + 1}`,
            bands: [{ freq: 1000, width: 500 }],
            scale: 1,
        };
        setEqSettings({ ...eqSettings, sliders: [...eqSettings.sliders, newSlider] });
    };

    const removeSlider = (id) => {
        const newSliders = eqSettings.sliders.filter(s => s.id !== id);
        setEqSettings({ ...eqSettings, sliders: newSliders });
    };

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {eqSettings.sliders.map((slider, index) => (
                    <motion.div
                        key={slider.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 border rounded-lg space-y-4 overflow-hidden"
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{`Band ${index + 1}`}</h4>
                            <Button variant="ghost" size="icon" onClick={() => removeSlider(slider.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Frequency (Hz)</Label>
                                <Input
                                    type="number"
                                    value={slider.bands[0].freq}
                                    onChange={(e) => updateSlider(slider.id, 'freq', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Width (Hz)</Label>
                                <Input
                                    type="number"
                                    value={slider.bands[0].width}
                                    onChange={(e) => updateSlider(slider.id, 'width', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Scale</Label>
                                <span className="text-sm text-muted-foreground">{slider.scale.toFixed(2)}x</span>
                            </div>
                            <Slider
                                min={0}
                                max={2}
                                step={0.05}
                                value={[slider.scale]}
                                onValueChange={(value) => updateSlider(slider.id, 'scale', value[0])}
                            />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            <Button onClick={addSlider} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Frequency Band
            </Button>
        </div>
    );
};