﻿import { ENDURANCE, EnduranceStatus } from './endurance.js';
import { GameStatusManager } from './game_status.js';
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

const getArenaParams = (): Object => {
	const G68 = (window as any).G68;
	return (window as any).A1.g1(G68.a21.type, G68.a21.mode, G68.a21.extraConf);
}

const changeTheatreMode = () => {
	const shadow = document.getElementById('shadow');
	const themeSwitcher = document.getElementsByClassName('theme-switcher')[0];
	if(shadow?.style.display !== 'block' && themeSwitcher){
		Array.from(themeSwitcher.getElementsByTagName('a')).find(a => 
			/ (Theatre mode|シアターモード|Theatermodus|Режим кинотеатра|Modo teatro|Modo Teatro|Modalità teatro|Mode théâtre|剧院模式|劇院模式|극장 모드)/.test(a.textContent ?? '')
		)?.click();
	}
}

const matchSize = (size: string): boolean => {
	const currentSize: number = (window as any).G68.l3;
	let result = false;
	if(!!currentSize) {
		if(
			size === 'Beginner' && currentSize === 1 ||
			size === 'Intermediate' && currentSize === 2 ||
			size === 'Expert' && currentSize === 3
		) {
			result = true;
		}
	}
	return result;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if(message.action === "getArenaParams") {
		if(!!sender.tab?.id) {
			chrome.scripting.executeScript({
				target: { tabId: sender.tab.id },
				world: 'MAIN',
				func: getArenaParams,
				args: message.args
			}).then((injectionResults) => {
				for (const {result} of injectionResults) {
					sendResponse(result);
				}
			});
		}
	} else if(message.action === "theatreMode") {
		if(!!sender.tab?.id) {
			chrome.scripting.executeScript({
				target: { tabId: sender.tab.id },
				func: changeTheatreMode
			});
		}
	} else if(message.action === "matchSize") {
		if(!!sender.tab?.id) {
			chrome.scripting.executeScript({
				target: { tabId: sender.tab.id },
				world: 'MAIN',
				func: matchSize,
				args: message.args
			}).then((injectionResults) => {
				for (const {result} of injectionResults) {
					sendResponse(result);
				}
			});
		}
	}
	return true;
});

chrome.runtime.onStartup.addListener(() => {
	GameStatusManager.get().then(gameStatus => {
		if(gameStatus && Object.keys(gameStatus).length) {
			let fileName = gameStatus.category;
			if(gameStatus instanceof EnduranceStatus) {
				fileName += gameStatus.size;
			}
			chrome.action.setIcon({
				path: {
					'128': `/icons/${fileName}.png`
				}
			});
		}
	});
});

chrome.storage.onChanged.addListener((changes) => {
	if('gameStatus' in changes) {
		const change = changes["gameStatus"];
		if(!change.oldValue && change.newValue) {
			let fileName: string = change.newValue.category;
			if(change.newValue.category === ENDURANCE) {
				fileName += change.newValue.size;
			}
			chrome.action.setIcon({
				path: {
					'128': `/icons/${fileName}.png`
				}
			});
		} else if(change.oldValue && !change.newValue) {
			chrome.action.setIcon({
				path: {
					'128': '/icons/icon128.png'
				}
			});
		}
	}
});
