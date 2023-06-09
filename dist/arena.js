export { ARENA, Arena, isGameType, isLevelType };
import { formatSecToHMS } from './common.js';
const ARENA = 'arena';
const gameType = ['ticket1', 'ticket2', 'ticket3', 'ticket4', 'ticket5', 'ticket6', 'ticket7', 'ticket8', 'ticket9', 'ticket10'];
const levelType = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
const isGameType = (value) => {
    return gameType.some(v => v === value);
};
const isLevelType = (value) => {
    return levelType.some(v => v === value);
};
class Arena {
    type;
    level;
    elite;
    category = ARENA;
    games;
    timeLimit;
    averageDifficulty;
    wins = 0;
    remainTime;
    remainGame;
    lastGameTime = 0;
    currentSize = '';
    constructor(type, level, elite, init) {
        this.type = type;
        this.level = level;
        this.elite = elite;
        [this.games, this.timeLimit, this.averageDifficulty] = GAMES_AND_TIME_LIMITS[this.type][this.level][this.elite ? 'elite' : 'classic'];
        this.remainGame = this.games;
        this.remainTime = this.timeLimit;
        Object.assign(this, init);
    }
    recordWin(wins, remainTime, size) {
        this.wins = wins;
        this.remainGame = this.games - wins + 1;
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
                const borderTime = this.timeLimit / this.games * (this.remainGame - 1);
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
    estimateWinTime(difficulty) {
        const result = Math.trunc(difficulty / (this.averageDifficulty / (this.timeLimit / this.games)));
        return formatSecToHMS(result);
    }
}
const createLevels = (classicGames, eliteGames, classicTimeLimits, eliteTimeLimits, classicDifficulty, eliteDifficulty) => {
    const levels = {};
    for (let i = 0; i < 8; i++) {
        levels[`${levelType[i]}`] = {
            classic: [classicGames[i], classicTimeLimits[i], classicDifficulty[i]],
            elite: [eliteGames[i], eliteTimeLimits[i], eliteDifficulty[i]]
        };
    }
    return levels;
};
const baseGames = [5, 10, 15, 20, 25, 30, 35, 40];
const baseClassicTimeLimits = [15, 20, 30, 40, 50, 60, 75, 90].map(t => t * 60);
const baseEliteTimeLimits = [20, 30, 40, 55, 70, 85, 100, 120].map(t => t * 60);
const enduranceTimeLimits = [1, 2, 3, 4, 5, 6, 7, 8].map(t => t * 86400);
const ticket1ClassicDifficulty = [7.5, 9, 11, 15, 18.5, 22.5, 26, 30];
const ticket1EliteDifficulty = [15, 18.5, 22.5, 30, 37.5, 45, 52.5, 60];
const ticket2ClassicDifficulty = [7.5, 9, 11, 15, 18.5, 22.5, 26, 30];
const ticket2EliteDifficulty = [15, 18.5, 22.5, 30, 37.5, 45, 52.5, 60];
const ticket3ClassicDifficulty = [6, 7.5, 9, 11, 15, 18.5, 22.5, 26];
const ticket3EliteDifficulty = [12, 15, 18.5, 22.5, 30, 37.5, 45, 52.5];
const ticket4ClassicDifficulty = [3, 4.5, 6, 7.5, 9, 11, 13, 15];
const ticket4EliteDifficulty = [6, 9, 12, 15, 18.5, 22.5, 26, 30];
const ticket5ClassicDifficulty = [37.5, 75, 150, 300, 450, 750, 1000, 1250];
const ticket5EliteDifficulty = [75, 150, 300, 600, 900, 1500, 2000, 2500];
const ticket6ClassicDifficulty = [5.5, 13, 25.5, 38, 50.5, 75.5, 100.5, 125.5];
const ticket6EliteDifficulty = [10.5, 25.5, 50.5, 75.5, 100.5, 150.5, 200.5, 250.5];
const ticket7ClassicDifficulty = [6, 7.5, 9, 11, 15, 18.5, 22.5, 26];
const ticket7EliteDifficulty = [12, 15, 18.5, 22.5, 30, 37.5, 45, 52.5];
const ticket8ClassicDifficulty = [6, 7.5, 9, 11, 13, 15, 18.5, 22.5];
const ticket8EliteDifficulty = [12, 15, 18.5, 22.5, 26, 30, 37.5, 45];
const ticket9Difficulty = [3, 5.5, 7.5, 10, 12.5, 15, 17.5, 20];
const ticket10Difficulty = [75, 100, 125, 150, 175, 150, 250, 300];
const GAMES_AND_TIME_LIMITS = {
    ticket1: createLevels(baseGames, baseGames, baseClassicTimeLimits, baseEliteTimeLimits, ticket1ClassicDifficulty, ticket1EliteDifficulty),
    ticket2: createLevels(baseGames, baseGames, baseClassicTimeLimits, baseEliteTimeLimits, ticket2ClassicDifficulty, ticket2EliteDifficulty),
    ticket3: createLevels(baseGames, baseGames, baseClassicTimeLimits, baseEliteTimeLimits, ticket3ClassicDifficulty, ticket3EliteDifficulty),
    ticket4: createLevels(baseGames, baseGames, baseClassicTimeLimits, baseEliteTimeLimits, ticket4ClassicDifficulty, ticket4EliteDifficulty),
    ticket5: createLevels(Array(8).fill(1), Array(8).fill(1), baseClassicTimeLimits, baseEliteTimeLimits, ticket5ClassicDifficulty, ticket5EliteDifficulty),
    ticket6: createLevels(Array(8).fill(10), Array(8).fill(10), baseClassicTimeLimits, baseEliteTimeLimits, ticket6ClassicDifficulty, ticket6EliteDifficulty),
    ticket7: createLevels(baseGames, baseGames, baseClassicTimeLimits.map(e => e * 2), baseEliteTimeLimits.map(e => e * 2), ticket7ClassicDifficulty, ticket7EliteDifficulty),
    ticket8: createLevels(baseGames, baseGames, baseClassicTimeLimits, baseEliteTimeLimits, ticket8ClassicDifficulty, ticket8EliteDifficulty),
    ticket9: createLevels(baseGames.map(e => e * 5), baseGames.map(e => e * 10), enduranceTimeLimits, enduranceTimeLimits, ticket9Difficulty, ticket9Difficulty),
    ticket10: createLevels(baseGames, baseGames.map(e => e * 2), enduranceTimeLimits, enduranceTimeLimits, ticket10Difficulty, ticket10Difficulty),
};
