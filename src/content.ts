﻿import { ARENA, ArenaStatus } from './arena.js';
import { ENDURANCE, EnduranceStatus } from './endurance.js';
import { GameStatusManager } from './game_status.js';
import { formatSecToHM } from './common.js';
import { OptionsManager } from './options.js';
import { MessagesLoader } from './messages.js';

const utterance = new SpeechSynthesisUtterance();

const speak = (text: string, volume: number = 0.5, rate: number = 1, lang: string = 'en') => {
	utterance.text = text;
	utterance.lang = lang;
	utterance.volume = volume;
	utterance.rate = rate;
	speechSynthesis.speak(utterance);
}

const isCorrectArenaTypes = (panel: Element, correctType: string, correctLevel: string, correctElite: boolean) => {
	const typeRegx = /ticket\d{1,2}/;
	const type = typeRegx.exec(panel.innerHTML)?.[0];
	const levelEliteRegx = /(L\d)(E?)/;
	const levelElite = levelEliteRegx.exec(panel.innerHTML);
	const level = levelElite?.[1];
	const elite = !!levelElite?.[2];
	return type === correctType && level === correctLevel && elite === correctElite;
}

const arenaObserverTarget = document.getElementById('A35') as HTMLElement;

const arenaObserver = new MutationObserver(mutations => {
	mutations.forEach(async mutation => {
		const panel = document.querySelector('.pull-left.arena-panel');
		if(panel && mutation.target instanceof HTMLElement) {
			const winsRegx = /(\d+) \/ \d+/;
			const wins = parseInt(winsRegx.exec(panel.innerHTML)?.[1] ?? '');
			const gameStatus = await GameStatusManager.get();
			if(
				gameStatus instanceof ArenaStatus &&
				isCorrectArenaTypes(panel, gameStatus.type, gameStatus.level, gameStatus.elite)
			) {
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
				if(remainTime && difficulty && size && options) {
					if(options.arenaTheatreMode) {
						chrome.runtime.sendMessage({ action: "theatreMode" });
					}
					const messages = await MessagesLoader.init(options.language);
					if(
						gameStatus.wins !== wins ||
						gameStatus.currentSize !== size
					) {
						gameStatus.recordWin(wins, remainTime.innerText, size);
						let textToSpeak = '';
						if(options.arenaRemainGames) {
							textToSpeak += messages.getMessage('notifyRemainGames', {'remainGames': gameStatus.remainGames});
						}
						if(options.arenaMineDensity && !!mineDensity) {
							textToSpeak += messages.getMessage('notifyMineDensity', {'mineDensity': mineDensity});
						}
						if(options.arenaDifficulty && !!difficulty) {
							textToSpeak += messages.getMessage('notifyDifficulty', {'difficulty': difficulty});
						}
						if(options.arenaWinProbability && !!winProbability) {
							textToSpeak += messages.getMessage('notifyWinProbability', {'winProbability': winProbability});
						}
						if(options.arenaTargetTime && !!difficulty) {
							textToSpeak += messages.getMessage('notifyTargetTime', {'targetTime': gameStatus.estimateWinTime(difficulty, messages)});
						}
						speak(textToSpeak, options.volume, options.rate, options.language);
						GameStatusManager.set(gameStatus);
					}
				} else {
					console.error(`remainTime: ${remainTime} or difficulty: ${difficulty} or options: ${options} does not exist`);
				}
			}
		}
	});
});

const arenaObserverConfig: MutationObserverInit = {
	attributes: true,
	attributeFilter: ['data-content'],
	subtree: true
};

let arenaNextNotificationTime = Infinity;

const arenaTimeObserver = new MutationObserver(mutations => {
	mutations.forEach(async mutation => {
		if(
			mutation.target instanceof HTMLElement &&
			mutation.target.id === 'arena_remain_time'
		) {
			const options = await OptionsManager.get();
			if(
				options &&
				options.arenaRemainTime
			) {
				const panel = document.querySelector('.pull-left.arena-panel');
				const gameStatus = await GameStatusManager.get();
				if(
					panel &&
					gameStatus instanceof ArenaStatus &&
					isCorrectArenaTypes(panel, gameStatus.type, gameStatus.level, gameStatus.elite)
				) {
					const remainTime = gameStatus.calcRemainTime(mutation.target.innerText);
					const remainTimeInMinutes = Math.trunc(remainTime / 60);
					if(remainTimeInMinutes < arenaNextNotificationTime) {
						const messages = await MessagesLoader.init(options.language);
						const textToSpeak = `${formatSecToHM(remainTime + 60, messages)}, `;
						speak(textToSpeak, options.volume, options.rate, options.language);
						// NOTE: arenaNextNotificationTimeはarenaRemainTimeNotifyIntervalの倍数にする
						arenaNextNotificationTime = Math.floor(remainTimeInMinutes / options.arenaRemainTimeNotifyInterval) * options.arenaRemainTimeNotifyInterval;
					}
				}
			}
		}
	});
});

const arenaTimeObserverConfig: MutationObserverInit = {
	childList: true,
	subtree: true
};

const startArena = () => {
	arenaObserver.observe(arenaObserverTarget, arenaObserverConfig);
	arenaNextNotificationTime = Infinity;
	arenaTimeObserver.observe(arenaObserverTarget, arenaTimeObserverConfig);
}

const stopArena = () => {
	arenaObserver.disconnect();
	arenaTimeObserver.disconnect();
}

const matchSize = async (size: string): Promise<boolean> => {
	return new Promise((resolve)=>{
		chrome.runtime.sendMessage({ action: "matchSize", args: [size] }, (response) => {
			resolve(response);
		});
	});
}

const enduranceObserverTarget = document.getElementById('G64') as HTMLElement;

let startPathname = '';
let winPathname = '';

const enduranceObserver = new MutationObserver(mutations => {
	mutations.forEach(async mutation => {
		if(
			mutation.target instanceof HTMLElement
		) {
			if(// 開始時
				startPathname !== location.pathname &&
				mutation.target.id.startsWith('cell_') &&
				(
					mutation.target.classList.contains('hd_opened') ||
					mutation.target.classList.contains('hd_flag')
				)
			) {
				const tmpPathname = startPathname;
				startPathname = location.pathname;//NOTE: GameStatusManager.getが何回も実行されるのを防ぐ
				const gameStatus = await GameStatusManager.get();
				if(
					gameStatus instanceof EnduranceStatus &&
					gameStatus.isCorrectStartPathname(startPathname) &&
					await matchSize(gameStatus.size)
				) {
					gameStatus.recordStart(startPathname);
					GameStatusManager.set(gameStatus);
				} else {
					startPathname = tmpPathname;
				}
			}else if(// 勝利時
				winPathname !== location.pathname &&
				mutation.target.id === 'top_area_face' &&
				mutation.target.classList.contains('hd_top-area-face-win')
			) {
				const tmpPathname = winPathname;
				winPathname = location.pathname;
				const gameStatus = await GameStatusManager.get();
				if(
					gameStatus instanceof EnduranceStatus &&
					gameStatus.isCorrectWinPathname(winPathname) &&
					await matchSize(gameStatus.size)
				) {
					const options = await OptionsManager.get();
					if(!!options) {
						const messages = await MessagesLoader.init(options.language);
						gameStatus.recordWin(winPathname);
						let textToSpeak = '';
						if(
							options.enduranceWins &&
							(
								gameStatus.getWins() < 100 ||
								!options.enduranceElapsedTime
							)
						) {
							const wins = gameStatus.getWins();
							textToSpeak += messages.getMessage('notifyWins', {'wins': wins}, wins);
						}
						if(
							options.enduranceElapsedTime &&
							gameStatus.getWins() >= 100
						) {
							textToSpeak += `${gameStatus.getRecordTimeHMS(messages)}, `;
						}
						speak(textToSpeak, options.volume, options.rate, options.language);
						GameStatusManager.set(gameStatus);
					} else {
						console.error(`options: ${options} does not exist`);
					}
				} else {
					winPathname = tmpPathname;
				}
			}
		}
	});
});

const enduranceObserveConfig: MutationObserverInit = {
	attributes: true,
	attributeFilter: ['class'],
	attributeOldValue: true,
	subtree: true
};

let intervalId: number | null = null;

const startEndurance = () => {
	enduranceObserver.observe(enduranceObserverTarget, enduranceObserveConfig);

	let nextNotificationTime = 0;
	intervalId = setInterval(async () => {
		const options = await OptionsManager.get();
		if(
			options &&
			options.enduranceElapsedTime
		) {
			const gameStatus = await GameStatusManager.get();
			if(
				gameStatus instanceof EnduranceStatus &&
				gameStatus.getWins() < 100
			) {
				const elapsedTimeInMinutes = Math.floor(gameStatus.getElapsedTime() / 60);
				if(elapsedTimeInMinutes >= nextNotificationTime) {
					const messages = await MessagesLoader.init(options.language);
					//NOTE: 0分だとgetElapsedTimeHMが空文字になるから一番最初は読み上げない
					const textToSpeak = `${gameStatus.getElapsedTimeHM(messages)}, `;
					speak(textToSpeak, options.volume, options.rate, options.language);
					//NOTE: nextNotificationTimeはenduranceElapsedTimeNotifyIntervalの倍数にする
					nextNotificationTime = Math.ceil((elapsedTimeInMinutes + 1) / options.enduranceElapsedTimeNotifyInterval) * options.enduranceElapsedTimeNotifyInterval;
				}
			}
		}
	}, 1000);
}

const stopEndurance = () => {
	enduranceObserver.disconnect();
	if (intervalId !== null) {
		clearInterval(intervalId);
		intervalId = null;
	}
}

GameStatusManager.get().then(gameStatus => {
	if(gameStatus && Object.keys(gameStatus).length) {
		if(gameStatus instanceof ArenaStatus) {
			startArena();
		} else if(gameStatus instanceof EnduranceStatus) {
			startEndurance();
		}
	}
});

chrome.storage.onChanged.addListener((changes) => {
	if('gameStatus' in changes) {
		const change = changes["gameStatus"];
		if(!change.oldValue && change.newValue) {
			if(change.newValue.category === ARENA) {
				startArena();
			} else if(change.newValue.category === ENDURANCE) {
				startEndurance();
			} else {
				console.error(`Invalid category: ${change.newValue.category}`);
			}
		} else if(change.oldValue && !change.newValue) {
			if(change.oldValue.category === ARENA) {
				stopArena();
			} else if(change.oldValue.category === ENDURANCE) {
				stopEndurance();
			} else {
				console.error(`Invalid category: ${change.oldValue.category}`);
			}
		}
	}
});
