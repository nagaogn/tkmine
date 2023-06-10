import { setOptions } from './common.js';
chrome.runtime.onInstalled.addListener(() => {
    const options = {
        volume: 0.5,
        arenaRemainGame: true,
        arenaRemainTime: true,
        arenaMineDensity: false,
        arenaDifficulty: false,
        arenaWinProbability: false,
        arenaTargetTime: false,
        enduranceWins: true,
        enduranceElapsedTime: true
    };
    setOptions(options);
});
