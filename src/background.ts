import { Options, OptionsManager } from './options.js';
import { MessagesLoader } from './messages.js';

const defaultOptions: Options = {
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
} as const;

const decideDefaultLanguage = async (defaultLanguage: string) => {
	let existLanguages: string[] = await new Promise((resolve) => 
		// NOTE: backgroundではspeechSynthesisを使えない
		chrome.tts.getVoices((voices) => {
			const langs = voices.map((voice) => voice.lang)
				.filter((lang): lang is string => typeof lang === 'string')
				.map((lang) => lang.split('-')[0])
				.filter((lang) => MessagesLoader.isLanguageType(lang));
			resolve([...new Set(langs)]);
		})
	);

	let result = defaultLanguage;
	const browserLanguage = navigator.language.split('-')[0];
	if(existLanguages.includes(browserLanguage)) {
		result = browserLanguage;
	} else if(existLanguages.includes(defaultLanguage)) {
		result = defaultLanguage;
	} else if(existLanguages.length > 0) {
		result = existLanguages[0];
	}
	return result;
}

chrome.runtime.onInstalled.addListener(async (details) => {
	let options = defaultOptions;
	options.language = await decideDefaultLanguage(options.language);
	if(details.reason === 'install') {
		OptionsManager.set(options);
	} else if(details.reason === 'update') {
		const currentOptions = await OptionsManager.get();
		const mergedOptions = { ...options, ...currentOptions };
		OptionsManager.set(mergedOptions);
	}
});

const changeTheatreMode = () => {
	const shadow = document.getElementById('shadow');
	const themeSwitcher = document.getElementById('theme-switcher');
	if(shadow?.style.display !== 'block' && themeSwitcher){
		Array.from(themeSwitcher.getElementsByTagName('a')).find(a => 
			/ (Theatre mode|シアターモード|Theatermodus|Режим кинотеатра|Modo teatro|Modo Teatro|Modalità teatro|Mode théâtre|剧院模式|劇院模式|극장 모드)/.test(a.textContent ?? '')
		)?.click();
	}
}

chrome.runtime.onMessage.addListener((message, sender) => {
	if(message.action === "theatreMode") {
		if(!!sender.tab?.id) {
			chrome.scripting.executeScript({
				target: { tabId: sender.tab.id },
				func: changeTheatreMode
			});
		}
    }
});
