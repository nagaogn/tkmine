import { OptionsManager } from './options.js';
import { MessagesLoader } from './messages.js';

(async () => {
	const options = await OptionsManager.get();
	if(!!options) {
		const messages = await MessagesLoader.load(options.language);
		const elements = document.querySelectorAll('[data-i18n]');
		for (const e of elements) {
			const messageName = e.getAttribute('data-i18n');
			if(!!messageName) {
				const message = messages[messageName].message;
				if (!!message) {
					if(e instanceof HTMLInputElement) {
						e.value = message;
					} else {
						e.textContent = message;
					}
				}
			}
		}
		(document.getElementById('language') as HTMLInputElement).value = options.language;
		(document.getElementById('volume') as HTMLInputElement).value = options.volume.toString();
		(document.getElementById('rate') as HTMLInputElement).value = options.rate.toString();
		(document.getElementById('arenaRemainGames') as HTMLInputElement).checked = options.arenaRemainGames;
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
	} else {
		console.error(`options does not exist`);
	}
})();

(document.getElementById('save') as HTMLElement).onclick = () => {
	const language = (document.getElementById('language') as HTMLInputElement).value;
	const volume = Number((document.getElementById('volume') as HTMLInputElement).value);
	const rate = Number((document.getElementById('rate') as HTMLInputElement).value);
	const arenaRemainGames = (document.getElementById('arenaRemainGames') as HTMLInputElement).checked;
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
	const options = {
		language,
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
	};
	OptionsManager.set(options);
	location.reload();
}
