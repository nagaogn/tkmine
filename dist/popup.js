import { ARENA, Arena, isGameType, isLevelType } from './arena.js';
import { ENDURANCE, Endurance, isSizeType } from './endurance.js';
import { setGameStatus, getGameStatus, removeGameStatus } from './common.js';
(async () => {
    const gameStatus = await getGameStatus();
    if (gameStatus) {
        if (gameStatus instanceof Arena) {
            document.getElementById('arena').checked = true;
            document.getElementById('type').value = gameStatus.type;
            document.getElementById('level').value = gameStatus.level;
            document.getElementById('elite').checked = gameStatus.elite;
        }
        else if (gameStatus instanceof Endurance) {
            document.getElementById('endurance').checked = true;
            document.getElementById('size').value = gameStatus.size;
        }
        else {
            console.error(`Unexpected instance`);
        }
        document.querySelectorAll('input[type="radio"], input[type="checkbox"], select').forEach(e => {
            e?.setAttribute('disabled', '');
        });
        document.getElementById('start').classList.add('hide');
    }
    else {
        document.getElementById('stop').classList.add('hide');
    }
})();
document.getElementById('start').onclick = () => {
    const category = document.querySelector('[name="category"]:checked').value;
    let gameStatus;
    if (category === ARENA) {
        const type = document.getElementById('type').value;
        const level = document.getElementById('level').value;
        const elite = document.getElementById('elite').checked;
        if (isGameType(type) && isLevelType(level)) {
            gameStatus = new Arena(type, level, elite);
        }
        else {
            console.error(`Invalid game type: ${type} or level: ${level}`);
            return;
        }
    }
    else if (category === ENDURANCE) {
        const size = document.getElementById('size').value;
        if (isSizeType(size)) {
            gameStatus = new Endurance(size);
        }
        else {
            console.error(`Invalid size: ${size}`);
            return;
        }
    }
    else {
        console.error(`Unexpected category: ${category}`);
        return;
    }
    setGameStatus(gameStatus);
    chrome.tabs.query({ url: 'https://minesweeper.online/*' }, tabs => {
        tabs.forEach(tab => {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, { action: 'start', category: category });
            }
        });
    });
    window.close();
};
document.getElementById('stop').onclick = () => {
    removeGameStatus();
    chrome.tabs.query({ url: 'https://minesweeper.online/*' }, tabs => {
        tabs.forEach(tab => {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, { action: 'stop' });
            }
        });
    });
    window.close();
};
