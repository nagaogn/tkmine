export { Options, defaultOptions, setOptions, getOptions };

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
    language: string;
}

const defaultOptions: Options = {
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

const setOptions = (options: Options) => {
	chrome.storage.local.set({ options: options });
}

const getOptions = async (): Promise<Options | undefined> => {
	return await new Promise(resolve => {
		chrome.storage.local.get('options', result => resolve(result.options));
	});
}