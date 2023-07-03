import { setOptions, getOptions } from './common.js';
chrome.runtime.onInstalled.addListener(async (details) => {
    const defaultOptions = {
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
    };
    if (details.reason === 'install') {
        setOptions(defaultOptions);
    }
    else if (details.reason === 'update') {
        const currentOptions = await getOptions();
        const mergedOptions = { ...defaultOptions, ...currentOptions };
        setOptions(mergedOptions);
    }
});
