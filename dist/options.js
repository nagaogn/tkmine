export { OptionsManager };
class OptionsManager {
    static defaultOptions = {
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
    static setOptions = (options) => {
        chrome.storage.local.set({ options: options });
    };
    static getOptions = async () => {
        return await new Promise(resolve => {
            chrome.storage.local.get('options', result => resolve(result.options));
        });
    };
}
