export { Options, OptionsManager };

interface Options {
	language: string;
	volume: number;
	rate: number;
	arenaRemainGames: boolean;
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

class OptionsManager{
	static set = (options: Options) => {
		chrome.storage.local.set({ options: options });
	}

	static get = async (): Promise<Options | undefined> => {
		return await new Promise(resolve => {
			chrome.storage.local.get('options', result => resolve(result.options));
		});
	}
}