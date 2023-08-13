import { OptionsManager } from './options.js';

chrome.runtime.onInstalled.addListener(async (details) => {
	if(details.reason === 'install') {
		OptionsManager.set(OptionsManager.defaultOptions);
	} else if(details.reason === 'update') {
		const currentOptions = await OptionsManager.get();
		const mergedOptions = { ...OptionsManager.defaultOptions, ...currentOptions };
		OptionsManager.set(mergedOptions);
	}
});
