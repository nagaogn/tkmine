import { setOptions } from './common.js';
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        const options = {
            volume: 0.5,
            arenaRemainGame: true,
            arenaRemainTime: true,
            arenaMineDensity: false,
            arenaDifficulty: false,
            arenaWinProbability: false,
            arenaTargetTime: false,
            arenaTheatreMode: false,
            enduranceWins: true,
            enduranceElapsedTime: true
        };
        setOptions(options);
    }
});
