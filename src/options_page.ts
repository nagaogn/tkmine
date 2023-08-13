﻿import { OptionsManager } from './options.js';

(async () => {
    const options = await OptionsManager.getOptions();
    if(options) {
        (document.getElementById('volume') as HTMLInputElement).value = options.volume.toString();
        (document.getElementById('rate') as HTMLInputElement).value = options.rate.toString();
        (document.getElementById('arenaRemainGame') as HTMLInputElement).checked = options.arenaRemainGame;
        (document.getElementById('arenaRemainTime') as HTMLInputElement).checked = options.arenaRemainTime;
        (document.getElementById('arenaRemainTimeNotifyInterval') as HTMLInputElement).value = options.arenaRemainTimeNotifyInterval.toString();
        (document.getElementById('arenaMineDensity') as HTMLInputElement).checked = options.arenaMineDensity;
        (document.getElementById('arenaDifficulty') as HTMLInputElement).checked = options.arenaDifficulty;
        (document.getElementById('arenaWinProbability') as HTMLInputElement).checked = options.arenaWinProbability;
        (document.getElementById('arenaTargetTime') as HTMLInputElement).checked = options.arenaTargetTime;
        (document.getElementById('arenaTheatreMode') as HTMLInputElement).checked = options.arenaTheatreMode;
        (document.getElementById('enduranceWins') as HTMLInputElement).checked = options.enduranceWins;
        (document.getElementById('enduranceElapsedTime') as HTMLInputElement).checked = options.enduranceElapsedTime;
        (document.getElementById('enduranceElapsedTimeNotifyInterval') as HTMLInputElement).value = options.enduranceElapsedTimeNotifyInterval.toString();
        (document.getElementById('language') as HTMLInputElement).value = options.language;
    } else {
        console.error(`options does not exist`);
    }
})();

(document.getElementById('save') as HTMLElement).onclick = () => {
    const volume = Number((document.getElementById('volume') as HTMLInputElement).value);
    const rate = Number((document.getElementById('rate') as HTMLInputElement).value);
    const arenaRemainGame = (document.getElementById('arenaRemainGame') as HTMLInputElement).checked;
    const arenaRemainTime = (document.getElementById('arenaRemainTime') as HTMLInputElement).checked;
    const arenaRemainTimeNotifyInterval = Math.trunc(Number((document.getElementById('arenaRemainTimeNotifyInterval') as HTMLInputElement).value));
    const arenaMineDensity = (document.getElementById('arenaMineDensity') as HTMLInputElement).checked;
    const arenaDifficulty = (document.getElementById('arenaDifficulty') as HTMLInputElement).checked;
    const arenaWinProbability = (document.getElementById('arenaWinProbability') as HTMLInputElement).checked;
    const arenaTargetTime = (document.getElementById('arenaTargetTime') as HTMLInputElement).checked;
    const arenaTheatreMode = (document.getElementById('arenaTheatreMode') as HTMLInputElement).checked;
    const enduranceWins = (document.getElementById('enduranceWins') as HTMLInputElement).checked;
    const enduranceElapsedTime = (document.getElementById('enduranceElapsedTime') as HTMLInputElement).checked;
    const enduranceElapsedTimeNotifyInterval = Math.trunc(Number((document.getElementById('enduranceElapsedTimeNotifyInterval') as HTMLInputElement).value));
    const language = (document.getElementById('language') as HTMLInputElement).value;
    const options = {
        volume,
        rate,
        arenaRemainGame,
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
    OptionsManager.setOptions(options);
    location.reload();
}
