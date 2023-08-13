export { GameStatusManager };
import { ARENA, Arena } from './arena.js';
import { ENDURANCE, Endurance } from './endurance.js';

type GameStatus = Arena | Endurance;

class GameStatusManager {
	static set = (gameStatus: GameStatus) => {
		chrome.storage.local.set({ gameStatus: gameStatus });
	}

	static get = async (): Promise<GameStatus | undefined> => {
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

	static remove = () => {
		chrome.storage.local.remove('gameStatus');
	}
}