import { ARENA, ArenaStatus } from './arena.js';
import { ENDURANCE, EnduranceStatus } from './endurance.js';

export { GameStatusManager };

type GameStatus = ArenaStatus | EnduranceStatus;

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
				result = new ArenaStatus(gameStatus as ArenaStatus);
			} else if(gameStatus.category === ENDURANCE) {
				result = new EnduranceStatus(
					(gameStatus as EnduranceStatus).size,
					gameStatus as EnduranceStatus
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