import { OptionsManager } from './options.js';
chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        OptionsManager.setOptions(OptionsManager.defaultOptions);
    }
    else if (details.reason === 'update') {
        const currentOptions = await OptionsManager.getOptions();
        const mergedOptions = { ...OptionsManager.defaultOptions, ...currentOptions };
        OptionsManager.setOptions(mergedOptions);
    }
});
