import { MessagesLoader } from './messages.js';
import { formatSecToHMS } from './common.js';

export { ARENA, ArenaStatus };

const ARENA = 'arena' as const;

class ArenaStatus {
	category: string = ARENA;
	games: number = 0;
	timeLimit: number = 0;
	averageDifficulty: number = 0;
	wins: number = 0;
	remainTime: number = 0;
	remainGames: number = 0;
	lastGameTime: number = 0;
	currentSize: string = '';

	constructor(
		init?: Partial<ArenaStatus>
	) {
		Object.assign(this, init);
	}

	public recordWin(wins: number, remainTime: string, size: string) {
		this.wins = wins;
		this.remainGames = this.games - wins + 1;
		const t = this.calcRemainTime(remainTime);
		this.lastGameTime = this.remainTime - t;
		this.remainTime = t;
		this.currentSize = size;
	}

	public calcRemainTime(remainTime : string): number {
		const pattern = /^(\+|–)?(?:(\d{2,3}):)?(\d{2}):(\d{2})$/;
		const match = remainTime.match(pattern);
		let result = 0;
		if(match){
			const s = match[2] === undefined ? 3 : 2;
			for (let i = s; i <= 4; i++) {
				const t = parseInt(match[i]);
				result += t * (60 ** (4 - i));
			}
			if(!!match[1]) {
				const borderTime = this.timeLimit / this.games * (this.remainGames - 1);
				if(match[1] === '+') {
					result = borderTime + result;
				} else if(match[1] === '–') {
					result = borderTime - result;
				}
			}
		} else {
			console.error(`Invalid format: ${remainTime}`);
		}
		return result;
	}

	// NOTE:
	// 1: 複雑さのみを考慮したクリア時間目安
	// 現ゲームの複雑さ/(平均複雑さ/(全所要時間(秒)/全ゲーム数))
	// 2: 複雑さ、残り時間、残りゲーム数を考慮したクリア時間目安
	// 現ゲームの複雑さ/(平均複雑さ/(残り時間(秒)/残りゲーム数))
	// 1を採用
	public estimateWinTime(difficulty: number, messages: MessagesLoader) {
		const result = Math.trunc(difficulty / (this.averageDifficulty / (this.timeLimit / this.games)));
		return formatSecToHMS(result, messages);
	}
}
