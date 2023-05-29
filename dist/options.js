import { setOptions, getOptions } from './common.js';
(async () => {
    const options = await getOptions();
    if (options) {
        document.getElementById('arenaRemainGame').checked = options.arenaRemainGame;
        document.getElementById('arenaRemainTime').checked = options.arenaRemainTime;
        document.getElementById('arenaMineDensity').checked = options.arenaMineDensity;
        document.getElementById('arenaDifficulty').checked = options.arenaDifficulty;
        document.getElementById('arenaWinProbability').checked = options.arenaWinProbability;
        document.getElementById('arenaTargetTime').checked = options.arenaTargetTime;
        document.getElementById('enduranceWins').checked = options.enduranceWins;
        document.getElementById('enduranceElapsedTime').checked = options.enduranceElapsedTime;
    }
    else {
        console.error(`options does not exist`);
    }
})();
document.getElementById('save').onclick = () => {
    const arenaRemainGame = document.getElementById('arenaRemainGame').checked;
    const arenaRemainTime = document.getElementById('arenaRemainTime').checked;
    const arenaMineDensity = document.getElementById('arenaMineDensity').checked;
    const arenaDifficulty = document.getElementById('arenaDifficulty').checked;
    const arenaWinProbability = document.getElementById('arenaWinProbability').checked;
    const arenaTargetTime = document.getElementById('arenaTargetTime').checked;
    const enduranceWins = document.getElementById('enduranceWins').checked;
    const enduranceElapsedTime = document.getElementById('enduranceElapsedTime').checked;
    const options = {
        arenaRemainGame,
        arenaRemainTime,
        arenaMineDensity,
        arenaDifficulty,
        arenaWinProbability,
        arenaTargetTime,
        enduranceWins,
        enduranceElapsedTime,
    };
    setOptions(options);
};
