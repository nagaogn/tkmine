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
