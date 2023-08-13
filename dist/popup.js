import { ARENA, Arena } from './arena.js';
import { ENDURANCE, Endurance } from './endurance.js';
import { GameStatusManager } from './game_status.js';
import { OptionsManager } from './options.js';
import { MessagesLoader } from './messages.js';
(async () => {
    const options = await OptionsManager.get();
    const messages = await MessagesLoader.load(options?.language);
    const elements = document.querySelectorAll('[data-i18n]');
    for (const e of elements) {
        const messageName = e.getAttribute('data-i18n');
        if (!!messageName) {
            const message = messages[messageName].message;
            if (!!message) {
                if (e instanceof HTMLInputElement) {
                    e.value = message;
                }
                else {
                    e.textContent = message;
                }
            }
        }
    }
    const gameStatus = await GameStatusManager.get();
    if (!!gameStatus) {
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
        if (Arena.isGameType(type) && Arena.isLevelType(level)) {
            gameStatus = new Arena(type, level, elite);
        }
        else {
            console.error(`Invalid game type: ${type} or level: ${level}`);
            return;
        }
    }
    else if (category === ENDURANCE) {
        const size = document.getElementById('size').value;
        if (Endurance.isSizeType(size)) {
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
    GameStatusManager.set(gameStatus);
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
    GameStatusManager.remove();
    chrome.tabs.query({ url: 'https://minesweeper.online/*' }, tabs => {
        tabs.forEach(tab => {
            if (tab.id) {
                const category = document.querySelector('[name="category"]:checked').value;
                chrome.tabs.sendMessage(tab.id, { action: 'stop', category: category });
            }
        });
    });
    window.close();
};
document.getElementById('options').onclick = () => {
    chrome.runtime.openOptionsPage();
};
