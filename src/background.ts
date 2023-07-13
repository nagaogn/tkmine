import { defaultOptions, setOptions, getOptions } from './options.js';

chrome.runtime.onInstalled.addListener(async (details) => {
	if(details.reason === 'install') {
		setOptions(defaultOptions);
	} else if(details.reason === 'update') {
		const currentOptions = await getOptions();
		const mergedOptions = { ...defaultOptions, ...currentOptions };
		setOptions(mergedOptions);
	}
});
