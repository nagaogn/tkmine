import { ARENA, Arena } from './arena.js';
import { ENDURANCE, Endurance } from './endurance.js';
import { GameStatusManager } from './game_status.js';
import { formatSecToHM } from './common.js';
import { OptionsManager } from './options.js';
import { MessagesLoader } from './messages.js';
const utterance = new SpeechSynthesisUtterance();
const speak = (text, volume = 0.5, rate = 1, lang = 'en') => {
    utterance.text = text;
    utterance.lang = lang;
    utterance.volume = volume;
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
};
const isCorrectArenaTypes = (panel, correctType, correctLevel, correctElite) => {
    const typeRegx = /ticket\d{1,2}/;
    const type = typeRegx.exec(panel.innerHTML)?.[0];
    const levelEliteRegx = /(L\d)(E?)/;
    const levelElite = levelEliteRegx.exec(panel.innerHTML);
    const level = levelElite?.[1];
    const elite = !!levelElite?.[2];
    return type === correctType && level === correctLevel && elite === correctElite;
};
const arenaObserverTarget = document.getElementById('A35');
const arenaObserver = new MutationObserver(mutations => {
    mutations.forEach(async (mutation) => {
        const panel = document.querySelector('.pull-left.arena-panel');
        if (panel && mutation.target instanceof HTMLElement) {
            const winsRegx = /(\d+) \/ \d+/;
            const wins = parseInt(winsRegx.exec(panel.innerHTML)?.[1] ?? '');
            const gameStatus = await GameStatusManager.get();
            if (gameStatus instanceof Arena &&
                isCorrectArenaTypes(panel, gameStatus.type, gameStatus.level, gameStatus.elite)) {
                const remainTime = document.getElementById('arena_remain_time');
                const difficultyRegx = /(?:複雑さ|Difficulty|Schwierigkeit|Сложность|Complejidad|Dificuldade|Difficoltà|Difficulté|难度|難度|난이도)(?: ?: |：)(?:<img src="\/img\/skull.svg" class="diff-icon" alt="Difficulty"\/>)?([\d ]+)/;
                const difficulty = Number(difficultyRegx.exec(mutation.target.getAttribute('data-content') ?? '')?.[1].trim());
                const sizeRegx = /\d+x\d+\/\d+/;
                const size = sizeRegx.exec(mutation.target.getAttribute('data-content') ?? '')?.[0];
                const mineDensityRegx = /(?:爆弾の密度|Mine density|Minendichte|Плотность мин|Densidad de minas|Densidade de minas|Densità di mine|Densité des mines|雷密度|地雷密度|지뢰 밀도)(?: ?: |：)<span class=".*">(\d+(\.\d+)?%)<\/span>/;
                const mineDensity = mineDensityRegx.exec(mutation.target.getAttribute('data-content') ?? '')?.[1];
                const winProbabilityRegx = /(?:勝率|Win Probability|Sieg|Вероятность победы|Probabilidad de victoria|Probabilidade da Vitória|Probabilità di vittoria|Probabilité de victoire|胜率|獲勝機率|승리 확률)(?: ?: |：)(\d+(\.\d+)?%)/;
                const winProbability = winProbabilityRegx.exec(mutation.target.getAttribute('data-content') ?? '')?.[1];
                const options = await OptionsManager.get();
                if (remainTime && difficulty && size && options) {
                    const messages = await MessagesLoader.load(options.language);
                    if (gameStatus.wins !== wins ||
                        gameStatus.currentSize !== size) {
                        gameStatus.recordWin(wins, remainTime.innerText, size);
                        let textToSpeak = '';
                        if (options.arenaRemainGames) {
                            textToSpeak += MessagesLoader.replace(messages['notifyRemainGames'].message, { 'remainGames': gameStatus.remainGames });
                        }
                        if (options.arenaMineDensity && !!mineDensity) {
                            textToSpeak += MessagesLoader.replace(messages['notifyMineDensity'].message, { 'mineDensity': mineDensity });
                        }
                        if (options.arenaDifficulty && !!difficulty) {
                            textToSpeak += MessagesLoader.replace(messages['notifyDifficulty'].message, { 'difficulty': difficulty });
                        }
                        if (options.arenaWinProbability && !!winProbability) {
                            textToSpeak += MessagesLoader.replace(messages['notifyWinProbability'].message, { 'winProbability': winProbability });
                        }
                        if (options.arenaTargetTime && !!difficulty) {
                            textToSpeak += MessagesLoader.replace(messages['notifyTargetTime'].message, { 'targetTime': gameStatus.estimateWinTime(difficulty, messages) });
                        }
                        speak(textToSpeak, options.volume, options.rate);
                        GameStatusManager.set(gameStatus);
                        if (options.arenaTheatreMode) {
                            const shadow = document.getElementById('shadow');
                            const themeSwitcher = document.getElementById('theme-switcher');
                            if (shadow?.style.display !== 'block' && themeSwitcher) {
                                Array.from(themeSwitcher.getElementsByTagName('a')).find(a => / (Theatre mode|シアターモード|Theatermodus|Режим кинотеатра|Modo teatro|Modo Teatro|Modalità teatro|Mode théâtre|剧院模式|劇院模式|극장 모드)/.test(a.textContent ?? ''))?.click();
                            }
                        }
                    }
                }
                else {
                    console.error(`remainTime: ${remainTime} or difficulty: ${difficulty} or options: ${options} does not exist`);
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
let arenaNextNotificationTime = Infinity;
const arenaTimeObserver = new MutationObserver(mutations => {
    mutations.forEach(async (mutation) => {
        if (mutation.target instanceof HTMLElement &&
            mutation.target.id === 'arena_remain_time') {
            const options = await OptionsManager.get();
            if (options &&
                options.arenaRemainTime) {
                const panel = document.querySelector('.pull-left.arena-panel');
                const gameStatus = await GameStatusManager.get();
                if (panel &&
                    gameStatus instanceof Arena &&
                    isCorrectArenaTypes(panel, gameStatus.type, gameStatus.level, gameStatus.elite)) {
                    const remainTime = gameStatus.calcRemainTime(mutation.target.innerText);
                    const remainTimeInMinutes = Math.trunc(remainTime / 60);
                    if (remainTimeInMinutes < arenaNextNotificationTime) {
                        const messages = await MessagesLoader.load(options.language);
                        const textToSpeak = `${formatSecToHM(remainTime + 60, messages)}, `;
                        speak(textToSpeak, options.volume, options.rate);
                        arenaNextNotificationTime = Math.floor(remainTimeInMinutes / options.arenaRemainTimeNotifyInterval) * options.arenaRemainTimeNotifyInterval;
                    }
                }
            }
        }
    });
});
const arenaTimeObserverConfig = {
    childList: true,
    subtree: true
};
const startArena = () => {
    arenaObserver.observe(arenaObserverTarget, arenaObserverConfig);
    arenaNextNotificationTime = Infinity;
    arenaTimeObserver.observe(arenaObserverTarget, arenaTimeObserverConfig);
};
const stopArena = () => {
    arenaObserver.disconnect();
    arenaTimeObserver.disconnect();
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
                const gameStatus = await GameStatusManager.get();
                if (gameStatus instanceof Endurance &&
                    matchSize(gameStatus.size) &&
                    gameStatus.isCorrectStartPathname(startPathname)) {
                    gameStatus.recordStart(startPathname);
                    GameStatusManager.set(gameStatus);
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
                const gameStatus = await GameStatusManager.get();
                if (gameStatus instanceof Endurance &&
                    matchSize(gameStatus.size) &&
                    gameStatus.isCorrectWinPathname(winPathname)) {
                    const options = await OptionsManager.get();
                    if (!!options) {
                        const messages = await MessagesLoader.load(options.language);
                        gameStatus.recordWin(winPathname);
                        let textToSpeak = '';
                        if (options.enduranceWins &&
                            (gameStatus.getWins() < 100 ||
                                !options.enduranceElapsedTime)) {
                            textToSpeak += MessagesLoader.replace(messages['notifyWins'].message, { 'wins': gameStatus.getWins() });
                        }
                        if (options.enduranceElapsedTime &&
                            gameStatus.getWins() >= 100) {
                            textToSpeak += `${gameStatus.getRecordTimeHMS(messages)}, `;
                        }
                        speak(textToSpeak, options.volume, options.rate);
                        GameStatusManager.set(gameStatus);
                    }
                    else {
                        console.error(`options: ${options} does not exist`);
                    }
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
let intervalId = null;
const startEndurance = () => {
    enduranceObserver.observe(enduranceObserverTarget, enduranceObserveConfig);
    let nextNotificationTime = 0;
    intervalId = setInterval(async () => {
        const options = await OptionsManager.get();
        if (options &&
            options.enduranceElapsedTime) {
            const gameStatus = await GameStatusManager.get();
            if (gameStatus instanceof Endurance &&
                gameStatus.getWins() < 100) {
                const elapsedTimeInMinutes = Math.floor(gameStatus.getElapsedTime() / 60);
                if (elapsedTimeInMinutes >= nextNotificationTime) {
                    const messages = await MessagesLoader.load(options.language);
                    const textToSpeak = `${gameStatus.getElapsedTimeHM(messages)}, `;
                    speak(textToSpeak, options.volume, options.rate);
                    nextNotificationTime = Math.ceil((elapsedTimeInMinutes + 1) / options.enduranceElapsedTimeNotifyInterval) * options.enduranceElapsedTimeNotifyInterval;
                }
            }
        }
    }, 1000);
};
const stopEndurance = () => {
    enduranceObserver.disconnect();
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
};
GameStatusManager.get().then(gameStatus => {
    if (gameStatus && Object.keys(gameStatus).length) {
        if (gameStatus instanceof Arena) {
            startArena();
        }
        else if (gameStatus instanceof Endurance) {
            startEndurance();
        }
    }
});
chrome.runtime.onMessage.addListener(request => {
    if (request.action === 'start') {
        if (request.category === ARENA) {
            startArena();
        }
        else if (request.category === ENDURANCE) {
            startEndurance();
        }
        else {
            console.error(`Invalid category: ${request.category}`);
        }
    }
    else if (request.action === 'stop') {
        if (request.category === ARENA) {
            stopArena();
        }
        else if (request.category === ENDURANCE) {
            stopEndurance();
        }
        else {
            console.error(`Invalid category: ${request.category}`);
        }
    }
    else {
        console.error(`Invalid action: ${request.action}`);
    }
});
