import { setOptions } from './common.js';
const ttsOption = { lang: 'ja' };
chrome.runtime.onMessage.addListener(request => {
    if (request.action === 'speak') {
        chrome.tts.speak(request.text, ttsOption);
    }
});
chrome.runtime.onInstalled.addListener(() => {
    const options = {
        arenaRemainGame: true,
        arenaRemainTime: true,
        arenaMineDensity: false,
        arenaDifficulty: false,
        arenaWinProbability: false,
        arenaTargetTime: false,
        enduranceWins: true,
        enduranceElapsedTime: true
    };
    setOptions(options);
});
