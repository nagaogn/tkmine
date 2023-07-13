export { Options, setOptions, getOptions };

interface Options {
	volume: number;
	rate: number;
    arenaRemainGame: boolean;
    arenaRemainTime: boolean;
	arenaRemainTimeNotifyInterval: number;
    arenaMineDensity: boolean;
    arenaDifficulty: boolean;
    arenaWinProbability: boolean;
    arenaTargetTime: boolean;
    arenaTheatreMode: boolean;
    enduranceWins: boolean;
    enduranceElapsedTime: boolean;
	enduranceElapsedTimeNotifyInterval: number;
}

const setOptions = (options: Options) => {
	chrome.storage.local.set({ options: options });
}

const getOptions = async (): Promise<Options | undefined> => {
	return await new Promise(resolve => {
		chrome.storage.local.get('options', result => resolve(result.options));
	});
}