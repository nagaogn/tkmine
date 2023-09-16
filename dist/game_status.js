import { ARENA, ArenaStatus } from './arena.js';
import { ENDURANCE, EnduranceStatus } from './endurance.js';
export { GameStatusManager };
class GameStatusManager {
    static set = (gameStatus) => {
        chrome.storage.local.set({ gameStatus: gameStatus });
    };
    static get = async () => {
        const gameStatus = await new Promise(resolve => {
            chrome.storage.local.get('gameStatus', result => resolve(result.gameStatus));
        });
        let result;
        if (gameStatus) {
            if (gameStatus.category === ARENA) {
                result = new ArenaStatus(gameStatus.type, gameStatus.level, gameStatus.elite, gameStatus);
            }
            else if (gameStatus.category === ENDURANCE) {
                result = new EnduranceStatus(gameStatus.size, gameStatus);
            }
            else {
                console.error(`Unexpected category: ${gameStatus.category}`);
            }
        }
        return result;
    };
    static remove = () => {
        chrome.storage.local.remove('gameStatus');
    };
}
