export { defaultOptions, setOptions, getOptions };
const defaultOptions = {
    volume: 0.5,
    rate: 1,
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
    enduranceElapsedTimeNotifyInterval: 5,
    language: 'en'
};
const setOptions = (options) => {
    chrome.storage.local.set({ options: options });
};
const getOptions = async () => {
    return await new Promise(resolve => {
        chrome.storage.local.get('options', result => resolve(result.options));
    });
};
