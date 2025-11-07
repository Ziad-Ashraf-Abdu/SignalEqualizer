/**
 * Loads an equalizer settings file from the public folder.
 * @param {string} mode - The mode to load ('music', 'animals', 'voices').
 * @returns {Promise<object>} - The settings object.
 */
export const loadSettingsFile = async (mode) => {
    try {
        const response = await fetch(`/settings/${mode}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load settings for mode: ${mode}`);
        }
        const settings = await response.json();
        return settings;
    } catch (error) {
        console.error('Error loading settings:', error);
        // Return a default empty state
        return { mode, sliders: [] };
    }
};