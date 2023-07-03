import { ARENA, Arena } from './arena.js';
import { ENDURANCE, Endurance } from './endurance.js';
import { setGameStatus, getGameStatus, formatSecToHM, getOptions } from './common.js';

const utterance = new SpeechSynthesisUtterance();
utterance.lang = 'ja-JP';

const speak = (text: string, volume: number = 0.5) => {
	utterance.text = text;
	utterance.volume = volume;
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
			const gameStatus = await getGameStatus();
			if(
				gameStatus instanceof Arena &&
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
				const options = await getOptions();
				if(remainTime && difficulty && size && options) {
					if(
						gameStatus.wins !== wins ||
						gameStatus.currentSize !== size
					) {
						gameStatus.recordWin(wins, remainTime.innerText, size);
						let textToSpeak = '';
						if(options.arenaRemainGame) {
							textToSpeak += `残り, ${gameStatus.remainGame}回, `;
						}
						if(options.arenaMineDensity) {
							textToSpeak += `密度, ${mineDensity}, `;
						}
						if(options.arenaDifficulty) {
							textToSpeak += `複雑さ, ${difficulty}, `;
						}
						if(options.arenaWinProbability) {
							textToSpeak += `勝率, ${winProbability}, `;
						}
						if(options.arenaTargetTime) {
							textToSpeak += `目標, ${gameStatus.estimateWinTime(difficulty)}, `;
						}
						speak(textToSpeak, options.volume);
						setGameStatus(gameStatus);
						if(options.arenaTheatreMode) {
							const shadow = document.getElementById('shadow');
							const themeSwitcher = document.getElementById('theme-switcher');
							if(shadow?.style.display !== 'block' && themeSwitcher){
								Array.from(themeSwitcher.getElementsByTagName('a')).find(a => 
									/ (Theatre mode|シアターモード|Theatermodus|Режим кинотеатра|Modo teatro|Modo Teatro|Modalità teatro|Mode théâtre|剧院模式|劇院模式|극장 모드)/.test(a.textContent ?? '')
								)?.click();
							}
						}
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
			const options = await getOptions();
			if(
				options &&
				options.arenaRemainTime
			) {
				const panel = document.querySelector('.pull-left.arena-panel');
				const gameStatus = await getGameStatus();
				if(
					panel &&
					gameStatus instanceof Arena &&
					isCorrectArenaTypes(panel, gameStatus.type, gameStatus.level, gameStatus.elite)
				) {
					const remainTime = gameStatus.calcRemainTime(mutation.target.innerText);
					const remainTimeInMinutes = Math.trunc(remainTime / 60);
					if(remainTimeInMinutes < arenaNextNotificationTime) {
						const textToSpeak = `${formatSecToHM(remainTime + 60)}, `;
						speak(textToSpeak, options.volume);
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

const matchSize = (size: string): boolean => {
	const currentSize: HTMLElement | null = document.querySelector('.level-select-link.active');
	let result;
	if(!!currentSize) {
		if(
			size === 'Beginner' && /Beginner|初級|Anfänger|Новичок|Novato|Principiante|Principiante|Débutant|初级|初級|초급/.test(currentSize.innerText) ||
			size === 'Intermediate' && /Intermediate|中級|Fortgeschrittene|Любитель|Aficionado|Intermédio|Intermedio|Intermédiaire|中级|中級|중급/.test(currentSize.innerText) ||
			size === 'Expert' && /Expert|上級|Profis|Профессионал|Experimentado|Especialista|Esperto|Expert|高级|高級|상급/.test(currentSize.innerText)
		) {
			result = true;
		} else {
			result = false;
		}
	} else {
		result = false;
	}
	return result;
}

// FIXME: 耐久のカウント対象じゃないやつは除外したい
// Continue playing、Spectator mode、記録の再生
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
				startPathname = location.pathname;//NOTE: getGameStatusが何回も実行されるのを防ぐ
				const gameStatus = await getGameStatus();
				if(
					gameStatus instanceof Endurance &&
					matchSize(gameStatus.size) &&
					gameStatus.isCorrectStartPathname(startPathname)
				) {
					gameStatus.recordStart(startPathname);
					setGameStatus(gameStatus);
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
				const gameStatus = await getGameStatus();
				if(
					gameStatus instanceof Endurance &&
					matchSize(gameStatus.size) &&
					gameStatus.isCorrectWinPathname(winPathname)
				) {
					const options = await getOptions();
					if(options) {
						gameStatus.recordWin(winPathname);
						let textToSpeak = '';
						if(
							options.enduranceWins &&
							gameStatus.getWins() < 100
						) {
							textToSpeak += `${gameStatus.getWins()}回, `;
						}
						if(
							options.enduranceElapsedTime &&
							gameStatus.getWins() >= 100
						) {
							textToSpeak += `${gameStatus.getRecordTimeHMS()}, `;
						}
						speak(textToSpeak, options.volume);
						setGameStatus(gameStatus);
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
		const options = await getOptions();
		if(
			options &&
			options.enduranceElapsedTime
		) {
			const gameStatus = await getGameStatus();
			if(
				gameStatus instanceof Endurance &&
				gameStatus.getWins() < 100
			) {
				const elapsedTimeInMinutes = gameStatus.getElapsedTime() / 60;
				if(elapsedTimeInMinutes >= nextNotificationTime) {
					const textToSpeak = `${gameStatus.getElapsedTimeHM()}, `;
					speak(textToSpeak, options.volume);
					// NOTE: nextNotificationTimeはenduranceElapsedTimeNotifyIntervalの倍数にする
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

getGameStatus().then(gameStatus => {
	if(gameStatus && Object.keys(gameStatus).length) {
		if(gameStatus instanceof Arena) {
			startArena();
		} else if(gameStatus instanceof Endurance) {
			startEndurance();
		}
	}
});

chrome.runtime.onMessage.addListener(request => {
	if (request.action === 'start') {
		if(request.category === ARENA) {
			startArena();
		} else if(request.category === ENDURANCE) {
			startEndurance();
		} else {
			console.error(`Invalid category: ${request.category}`);
		}
	} else if(request.action === 'stop'){
		if(request.category === ARENA) {
			stopArena();
		} else if(request.category === ENDURANCE) {
			stopEndurance();
		} else {
			console.error(`Invalid category: ${request.category}`);
		}
	} else {
		console.error(`Invalid action: ${request.action}`);
	}
});
