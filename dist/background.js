import { OptionsManager } from './options.js';
import { MessagesLoader } from './messages.js';
const defaultOptions = {
    language: 'en',
    volume: 0.5,
    rate: 1,
    arenaRemainGames: true,
    arenaRemainTime: true,
    arenaRemainTimeNotifyInterval: 5,
    arenaMineDensity: false,
    arenaDifficulty: false,
    arenaWinProbability: false,
    arenaTargetTime: false,
    arenaTheatreMode: false,
    enduranceWins: true,
    enduranceElapsedTime: true,
    enduranceElapsedTimeNotifyInterval: 5,
};
const decideDefaultLanguage = async (defaultLanguage) => {
    let existLanguages = await new Promise((resolve) => chrome.tts.getVoices((voices) => {
        const langs = voices.map((voice) => voice.lang)
            .filter((lang) => typeof lang === 'string')
            .map((lang) => lang.split('-')[0])
            .filter((lang) => MessagesLoader.isLanguageType(lang));
        resolve([...new Set(langs)]);
    }));
    let result = defaultLanguage;
    const browserLanguage = navigator.language.split('-')[0];
    if (existLanguages.includes(browserLanguage)) {
        result = browserLanguage;
    }
    else if (existLanguages.includes(defaultLanguage)) {
        result = defaultLanguage;
    }
    else if (existLanguages.length > 0) {
        result = existLanguages[0];
    }
    return result;
};
chrome.runtime.onInstalled.addListener(async (details) => {
    let options = defaultOptions;
    options.language = await decideDefaultLanguage(options.language);
    if (details.reason === 'install') {
        OptionsManager.set(options);
    }
    else if (details.reason === 'update') {
        const currentOptions = await OptionsManager.get();
        const mergedOptions = { ...options, ...currentOptions };
        OptionsManager.set(mergedOptions);
    }
});
