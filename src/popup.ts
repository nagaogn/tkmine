import { ARENA, Arena } from './arena.js';
import { ENDURANCE, Endurance } from './endurance.js';
import { GameStatusManager } from './game_status.js';
import { OptionsManager } from './options.js';
import { MessagesLoader } from './messages.js';

(async () => {
	const options = await OptionsManager.get();
	const messages = await MessagesLoader.load(options?.language);
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
	const gameStatus = await GameStatusManager.get();
	if(!!gameStatus) {
		if(gameStatus instanceof Arena) {
			(document.getElementById('arena') as HTMLInputElement).checked = true;
			(document.getElementById('type') as HTMLInputElement).value = gameStatus.type;
			(document.getElementById('level') as HTMLInputElement).value = gameStatus.level;
			(document.getElementById('elite') as HTMLInputElement).checked = gameStatus.elite;
		} else if(gameStatus instanceof Endurance) {
			(document.getElementById('endurance') as HTMLInputElement).checked = true;
			(document.getElementById('size') as HTMLInputElement).value = gameStatus.size;
		} else {
			console.error(`Unexpected instance`);
		}
		document.querySelectorAll('input[type="radio"], input[type="checkbox"], select').forEach(e => {
			e?.setAttribute('disabled', '');
		});
		(document.getElementById('start') as HTMLElement).classList.add('hide');
	} else {
		(document.getElementById('stop') as HTMLElement).classList.add('hide');
	}
})();

(document.getElementById('start') as HTMLElement).onclick = () => {
	const category = (document.querySelector('[name="category"]:checked') as HTMLInputElement).value;
	let gameStatus;
	if(category === ARENA) {
		const type = (document.getElementById('type') as HTMLInputElement).value;
		const level = (document.getElementById('level') as HTMLInputElement).value;
		const elite = (document.getElementById('elite') as HTMLInputElement).checked;
		if(Arena.isGameType(type) && Arena.isLevelType(level)) {
			gameStatus = new Arena(type, level, elite);
		} else {
			console.error(`Invalid game type: ${type} or level: ${level}`);
			return;
		}
	} else if(category === ENDURANCE) {
		const size = (document.getElementById('size') as HTMLInputElement).value;
		if(Endurance.isSizeType(size)) {
			gameStatus = new Endurance(size);
		} else {
			console.error(`Invalid size: ${size}`);
			return;
		}
	} else {
		console.error(`Unexpected category: ${category}`);
		return;
	}
	GameStatusManager.set(gameStatus);
	chrome.tabs.query({ url: 'https://minesweeper.online/*' }, tabs => {
		tabs.forEach(tab => {
			if(tab.id) {
				chrome.tabs.sendMessage(tab.id, { action: 'start', category: category });
			}
		});
	});
	window.close();
}

(document.getElementById('stop') as HTMLElement).onclick = () => {
	GameStatusManager.remove();
	chrome.tabs.query({ url: 'https://minesweeper.online/*' }, tabs => {
		tabs.forEach(tab => {
			if(tab.id) {
				const category = (document.querySelector('[name="category"]:checked') as HTMLInputElement).value;
				chrome.tabs.sendMessage(tab.id, { action: 'stop', category: category });
			}
		});
	});
	window.close();
}

(document.getElementById('options') as HTMLElement).onclick = () => {
	chrome.runtime.openOptionsPage();
}
