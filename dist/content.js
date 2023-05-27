import { ARENA, Arena } from './arena.js';
import { ENDURANCE, Endurance } from './endurance.js';
import { setGameStatus, getGameStatus, formatSecToHMS } from './common.js';
const arenaObserverTarget = document.getElementById('A35');
const arenaObserver = new MutationObserver(mutations => {
    mutations.forEach(async (mutation) => {
        const panel = document.querySelector('.pull-left.arena-panel');
        if (panel && mutation.target instanceof HTMLElement) {
            const winsRegx = /(\d+) \/ \d+/;
            const wins = parseInt(winsRegx.exec(panel.innerHTML)?.[1] ?? '');
            const typeRegx = /ticket\d{1,2}/;
            const type = typeRegx.exec(panel.innerHTML)?.[0];
            const levelEliteRegx = /(L\d)(E?)/;
            const levelElite = levelEliteRegx.exec(panel.innerHTML);
            const level = levelElite?.[1];
            const elite = !!levelElite?.[2];
            const gameStatus = await getGameStatus();
            if (gameStatus instanceof Arena &&
                gameStatus.wins !== wins &&
                gameStatus.type === type &&
                gameStatus.level === level &&
                gameStatus.elite === elite) {
                const remainTime = document.getElementById('arena_remain_time');
                const difficultyRegx = /(?:複雑さ|Difficulty|Schwierigkeit|Сложность|Complejidad|Dificuldade|Difficoltà|Difficulté|难度|難度|난이도)(?: ?: |：)(?:<img src="\/img\/skull.svg" class="diff-icon" alt="Difficulty"\/>)?([\d ]+)/;
                const difficulty = difficultyRegx.exec(mutation.target.getAttribute('data-content') ?? '')?.[1].trim();
                if (remainTime && difficulty !== undefined) {
                    gameStatus.recordWin(wins, remainTime.innerText);
                    const textToSpeak = `残り${gameStatus.remainGame}回, 残り${formatSecToHMS(gameStatus.remainTime)}, 複雑さ${difficulty}, 目標${gameStatus.estimateWinTime(parseInt(difficulty))}`;
                    chrome.runtime.sendMessage({ action: 'speak', text: textToSpeak });
                    setGameStatus(gameStatus);
                }
            }
        }
    });
});
const arenaObserverConfig = {
    attributes: true,
    attributeFilter: ['data-content'],
    subtree: true
};
const matchSize = (size) => {
    const currentSize = document.querySelector('.level-select-link.active');
    let result;
    if (!!currentSize) {
        if (size === 'Beginner' && /Beginner|初級|Anfänger|Новичок|Novato|Principiante|Principiante|Débutant|初级|初級|초급/.test(currentSize.innerText) ||
            size === 'Intermediate' && /Intermediate|中級|Fortgeschrittene|Любитель|Aficionado|Intermédio|Intermedio|Intermédiaire|中级|中級|중급/.test(currentSize.innerText) ||
            size === 'Expert' && /Expert|上級|Profis|Профессионал|Experimentado|Especialista|Esperto|Expert|高级|高級|상급/.test(currentSize.innerText)) {
            result = true;
        }
        else {
            result = false;
        }
    }
    else {
        result = false;
    }
    return result;
};
const enduranceObserverTarget = document.getElementById('G64');
let startPathname = '';
let winPathname = '';
const enduranceObserver = new MutationObserver(mutations => {
    mutations.forEach(async (mutation) => {
        if (mutation.target instanceof HTMLElement) {
            if (startPathname !== location.pathname &&
                mutation.target.id.startsWith('cell_') &&
                (mutation.target.classList.contains('hd_opened') ||
                    mutation.target.classList.contains('hd_flag'))) {
                const tmpPathname = startPathname;
                startPathname = location.pathname;
                const gameStatus = await getGameStatus();
                if (gameStatus instanceof Endurance &&
                    matchSize(gameStatus.size) &&
                    gameStatus.isCorrectStartPathname(startPathname)) {
                    gameStatus.recordStart(startPathname);
                    setGameStatus(gameStatus);
                }
                else {
                    startPathname = tmpPathname;
                }
            }
            else if (winPathname !== location.pathname &&
                mutation.target.id === 'top_area_face' &&
                mutation.target.classList.contains('hd_top-area-face-win')) {
                const tmpPathname = winPathname;
                winPathname = location.pathname;
                const gameStatus = await getGameStatus();
                if (gameStatus instanceof Endurance &&
                    matchSize(gameStatus.size) &&
                    gameStatus.isCorrectWinPathname(winPathname)) {
                    gameStatus.recordWin(winPathname);
                    const textToSpeak = `${gameStatus.getWins()}回目, ${gameStatus.getElapsedTime()}`;
                    chrome.runtime.sendMessage({ action: 'speak', text: textToSpeak });
                    setGameStatus(gameStatus);
                }
                else {
                    winPathname = tmpPathname;
                }
            }
        }
    });
});
const enduranceObserveConfig = {
    attributes: true,
    attributeFilter: ['class'],
    attributeOldValue: true,
    subtree: true
};
const guideArena = () => {
    arenaObserver.observe(arenaObserverTarget, arenaObserverConfig);
};
const guideEndurance = () => {
    enduranceObserver.observe(enduranceObserverTarget, enduranceObserveConfig);
};
getGameStatus().then(gameStatus => {
    if (gameStatus && Object.keys(gameStatus).length) {
        if (gameStatus instanceof Arena) {
            guideArena();
        }
        else if (gameStatus instanceof Endurance) {
            guideEndurance();
        }
    }
});
chrome.runtime.onMessage.addListener(request => {
    if (request.action === 'start') {
        if (request.category === ARENA) {
            guideArena();
        }
        else if (request.category === ENDURANCE) {
            guideEndurance();
        }
        else {
            console.error(`Invalid category: ${request.category}`);
        }
    }
    else if (request.action === 'stop') {
        arenaObserver.disconnect();
        enduranceObserver.disconnect();
    }
    else {
        console.error(`Invalid action: ${request.action}`);
    }
});
