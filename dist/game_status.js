export { GameStatusManager };
import { ARENA, Arena } from './arena.js';
import { ENDURANCE, Endurance } from './endurance.js';
class GameStatusManager {
    static setGameStatus = (gameStatus) => {
        chrome.storage.local.set({ gameStatus: gameStatus });
    };
    static getGameStatus = async () => {
        const gameStatus = await new Promise(resolve => {
            chrome.storage.local.get('gameStatus', result => resolve(result.gameStatus));
        });
        let result;
        if (gameStatus) {
            if (gameStatus.category === ARENA) {
                result = new Arena(gameStatus.type, gameStatus.level, gameStatus.elite, gameStatus);
            }
            else if (gameStatus.category === ENDURANCE) {
                result = new Endurance(gameStatus.size, gameStatus);
            }
            else {
                console.error(`Unexpected category: ${gameStatus.category}`);
            }
        }
        return result;
    };
    static removeGameStatus = () => {
        chrome.storage.local.remove('gameStatus');
    };
}
