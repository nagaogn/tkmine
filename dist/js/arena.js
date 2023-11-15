import { formatSecToHMS } from './common.js';
export { ARENA, ArenaStatus };
const ARENA = 'arena';
class ArenaStatus {
    category = ARENA;
    games = 0;
    timeLimit = 0;
    averageDifficulty = 0;
    wins = 0;
    remainTime = 0;
    remainGames = 0;
    lastGameTime = 0;
    currentSize = '';
    constructor(init) {
        Object.assign(this, init);
    }
    recordWin(wins, remainTime, size) {
        this.wins = wins;
        this.remainGames = this.games - wins + 1;
        const t = this.calcRemainTime(remainTime);
        this.lastGameTime = this.remainTime - t;
        this.remainTime = t;
        this.currentSize = size;
    }
    calcRemainTime(remainTime) {
        const pattern = /^(\+|–)?(?:(\d{2,3}):)?(\d{2}):(\d{2})$/;
        const match = remainTime.match(pattern);
        let result = 0;
        if (match) {
            const s = match[2] === undefined ? 3 : 2;
            for (let i = s; i <= 4; i++) {
                const t = parseInt(match[i]);
                result += t * (60 ** (4 - i));
            }
            if (!!match[1]) {
                const borderTime = this.timeLimit / this.games * (this.remainGames - 1);
                if (match[1] === '+') {
                    result = borderTime + result;
                }
                else if (match[1] === '–') {
                    result = borderTime - result;
                }
            }
        }
        else {
            console.error(`Invalid format: ${remainTime}`);
        }
        return result;
    }
    estimateWinTime(difficulty, messages) {
        const result = Math.trunc(difficulty / (this.averageDifficulty / (this.timeLimit / this.games)));
        return formatSecToHMS(result, messages);
    }
}
