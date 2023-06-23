import { Options, setOptions, getOptions } from './common.js';

(async () => {
    const options = await getOptions();
    if(options) {
        (document.getElementById('volume') as HTMLInputElement).value = options.volume.toString();
        (document.getElementById('arenaRemainGame') as HTMLInputElement).checked = options.arenaRemainGame;
        (document.getElementById('arenaRemainTime') as HTMLInputElement).checked = options.arenaRemainTime;
        (document.getElementById('arenaMineDensity') as HTMLInputElement).checked = options.arenaMineDensity;
        (document.getElementById('arenaDifficulty') as HTMLInputElement).checked = options.arenaDifficulty;
        (document.getElementById('arenaWinProbability') as HTMLInputElement).checked = options.arenaWinProbability;
        (document.getElementById('arenaTargetTime') as HTMLInputElement).checked = options.arenaTargetTime;
        (document.getElementById('arenaTheatreMode') as HTMLInputElement).checked = options.arenaTheatreMode;
        (document.getElementById('enduranceWins') as HTMLInputElement).checked = options.enduranceWins;
        (document.getElementById('enduranceElapsedTime') as HTMLInputElement).checked = options.enduranceElapsedTime;
    } else {
        console.error(`options does not exist`);
    }
})();

(document.getElementById('save') as HTMLElement).onclick = () => {
    const volume = parseFloat((document.getElementById('volume') as HTMLInputElement).value);
    const arenaRemainGame = (document.getElementById('arenaRemainGame') as HTMLInputElement).checked;
    const arenaRemainTime = (document.getElementById('arenaRemainTime') as HTMLInputElement).checked;
    const arenaMineDensity = (document.getElementById('arenaMineDensity') as HTMLInputElement).checked;
    const arenaDifficulty = (document.getElementById('arenaDifficulty') as HTMLInputElement).checked;
    const arenaWinProbability = (document.getElementById('arenaWinProbability') as HTMLInputElement).checked;
    const arenaTargetTime = (document.getElementById('arenaTargetTime') as HTMLInputElement).checked;
    const arenaTheatreMode = (document.getElementById('arenaTheatreMode') as HTMLInputElement).checked;
    const enduranceWins = (document.getElementById('enduranceWins') as HTMLInputElement).checked;
    const enduranceElapsedTime = (document.getElementById('enduranceElapsedTime') as HTMLInputElement).checked;
    const options: Options = {
        volume,
        arenaRemainGame,
        arenaRemainTime,
        arenaMineDensity,
        arenaDifficulty,
        arenaWinProbability,
        arenaTargetTime,
        arenaTheatreMode,
        enduranceWins,
        enduranceElapsedTime,
    };
    setOptions(options);
}
