import { OptionsManager } from './options.js';
import { MessagesLoader } from './messages.js';
(async () => {
    const options = await OptionsManager.get();
    if (!!options) {
        const messages = await MessagesLoader.load(options.language);
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
        document.getElementById('volume').value = options.volume.toString();
        document.getElementById('rate').value = options.rate.toString();
        document.getElementById('arenaRemainGames').checked = options.arenaRemainGames;
        document.getElementById('arenaRemainTime').checked = options.arenaRemainTime;
        document.getElementById('arenaRemainTimeNotifyInterval').value = options.arenaRemainTimeNotifyInterval.toString();
        document.getElementById('arenaMineDensity').checked = options.arenaMineDensity;
        document.getElementById('arenaDifficulty').checked = options.arenaDifficulty;
        document.getElementById('arenaWinProbability').checked = options.arenaWinProbability;
        document.getElementById('arenaTargetTime').checked = options.arenaTargetTime;
        document.getElementById('arenaTheatreMode').checked = options.arenaTheatreMode;
        document.getElementById('enduranceWins').checked = options.enduranceWins;
        document.getElementById('enduranceElapsedTime').checked = options.enduranceElapsedTime;
        document.getElementById('enduranceElapsedTimeNotifyInterval').value = options.enduranceElapsedTimeNotifyInterval.toString();
        document.getElementById('language').value = options.language;
    }
    else {
        console.error(`options does not exist`);
    }
})();
document.getElementById('save').onclick = () => {
    const volume = Number(document.getElementById('volume').value);
    const rate = Number(document.getElementById('rate').value);
    const arenaRemainGames = document.getElementById('arenaRemainGames').checked;
    const arenaRemainTime = document.getElementById('arenaRemainTime').checked;
    const arenaRemainTimeNotifyInterval = Math.trunc(Number(document.getElementById('arenaRemainTimeNotifyInterval').value));
    const arenaMineDensity = document.getElementById('arenaMineDensity').checked;
    const arenaDifficulty = document.getElementById('arenaDifficulty').checked;
    const arenaWinProbability = document.getElementById('arenaWinProbability').checked;
    const arenaTargetTime = document.getElementById('arenaTargetTime').checked;
    const arenaTheatreMode = document.getElementById('arenaTheatreMode').checked;
    const enduranceWins = document.getElementById('enduranceWins').checked;
    const enduranceElapsedTime = document.getElementById('enduranceElapsedTime').checked;
    const enduranceElapsedTimeNotifyInterval = Math.trunc(Number(document.getElementById('enduranceElapsedTimeNotifyInterval').value));
    const language = document.getElementById('language').value;
    const options = {
        volume,
        rate,
        arenaRemainGames,
        arenaRemainTime,
        arenaRemainTimeNotifyInterval,
        arenaMineDensity,
        arenaDifficulty,
        arenaWinProbability,
        arenaTargetTime,
        arenaTheatreMode,
        enduranceWins,
        enduranceElapsedTime,
        enduranceElapsedTimeNotifyInterval,
        language
    };
    OptionsManager.set(options);
    location.reload();
};
