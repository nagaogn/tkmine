import { ARENA, Arena } from './arena.js';
import { ENDURANCE, Endurance } from './endurance.js';

export { GameStatus, setGameStatus, getGameStatus, removeGameStatus, formatSecToHMS, Options, setOptions, getOptions };

type GameStatus = Arena | Endurance;

const setGameStatus = (gameStatus: GameStatus) => {
	chrome.storage.local.set({ gameStatus: gameStatus });
}

const getGameStatus = async (): Promise<GameStatus | undefined> => {
	const gameStatus: GameStatus = await new Promise(resolve => {
		chrome.storage.local.get('gameStatus', result => resolve(result.gameStatus));
	});
	let result;
	if(gameStatus) {
		if(gameStatus.category === ARENA) {
			result = new Arena(
				(gameStatus as Arena).type,
				(gameStatus as Arena).level,
				(gameStatus as Arena).elite,
				gameStatus as Arena
			);
		} else if(gameStatus.category === ENDURANCE) {
			result = new Endurance(
				(gameStatus as Endurance).size,
				gameStatus as Endurance
			);
		} else {
			console.error(`Unexpected category: ${gameStatus.category}`);
		}
	}
	return result;
}

const removeGameStatus = () => {
	chrome.storage.local.remove('gameStatus');
}

const formatSecToHMS = (sec: number) => {
	const h = Math.trunc(sec / 3600);
	const m = Math.trunc((sec % 3600) / 60);
	const s = Math.trunc(sec % 60);
	let result = h === 0 ? '' : `${h}時間`;
	result += m === 0 ? '' : `${m}分`;
	result += s === 0 ? '' : `${s}秒`;
	return result;
}

interface Options {
	volume: number;
    arenaRemainGame: boolean;
    arenaRemainTime: boolean;
    arenaMineDensity: boolean;
    arenaDifficulty: boolean;
    arenaWinProbability: boolean;
    arenaTargetTime: boolean;
    enduranceWins: boolean;
    enduranceElapsedTime: boolean;
}

const setOptions = (options: Options) => {
	chrome.storage.local.set({ options: options });
}

const getOptions = async (): Promise<Options | undefined> => {
	return await new Promise(resolve => {
		chrome.storage.local.get('options', result => resolve(result.options));
	});
}