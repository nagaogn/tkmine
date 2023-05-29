import { ARENA, Arena } from './arena.js';
import { ENDURANCE, Endurance } from './endurance.js';
export { setGameStatus, getGameStatus, removeGameStatus, formatSecToHMS, setOptions, getOptions };
const setGameStatus = (gameStatus) => {
    chrome.storage.local.set({ gameStatus: gameStatus });
};
const getGameStatus = async () => {
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
const removeGameStatus = () => {
    chrome.storage.local.remove('gameStatus');
};
const formatSecToHMS = (sec) => {
    const h = Math.trunc(sec / 3600);
    const m = Math.trunc((sec % 3600) / 60);
    const s = sec % 60;
    let result = h === 0 ? '' : `${h}時間`;
    result += m === 0 ? '' : `${m}分`;
    result += s === 0 ? '' : `${s}秒`;
    return result;
};
const setOptions = (options) => {
    chrome.storage.local.set({ options: options });
};
const getOptions = async () => {
    return await new Promise(resolve => {
        chrome.storage.local.get('options', result => resolve(result.options));
    });
};
