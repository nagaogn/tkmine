import { Options, setOptions } from './common.js';

chrome.runtime.onInstalled.addListener((details) => {
	if(details.reason === 'install') {
		const options: Options = {
			volume: 0.5,
			arenaRemainGame: true,
			arenaRemainTime: true,
			arenaRemainTimeNotifyInterval: 5,
			arenaMineDensity: false,
			arenaDifficulty: false,
			arenaWinProbability: false,
			arenaTargetTime: false,
			arenaTheatreMode: false,
			enduranceWins: true,
			enduranceElapsedTime: true,
			enduranceElapsedTimeNotifyInterval: 5
		}
		setOptions(options);
	}
});


// chrome.storage.onChanged.addListener((changes, namespace) => {
// 	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
// 		console.log(
// 			`Storage key "${key}" in namespace "${namespace}" changed.`,
// 			`Old value was "${oldValue}", new value is "${newValue}".`
// 		);
// 	}
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// 	console.log("created tabs and update");
// 	if (changeInfo.status === 'complete') {
// 		console.log("status is complete");
// 	}
// });
