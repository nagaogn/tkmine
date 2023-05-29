import { Options, setOptions } from './common.js';

const ttsOption = { lang:'ja' };

chrome.runtime.onMessage.addListener(request => {
	if (request.action === 'speak') {
		chrome.tts.speak(request.text, ttsOption);
	}
});

chrome.runtime.onInstalled.addListener(() => {
	const options: Options = {
		arenaRemainGame: true,
		arenaRemainTime: true,
		arenaMineDensity: false,
		arenaDifficulty: false,
		arenaWinProbability: false,
		arenaTargetTime: false,
		enduranceWins: true,
		enduranceElapsedTime: true
	}
	setOptions(options);
});

//TODO アイコンを動的に変える


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
