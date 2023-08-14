export { ENDURANCE, Endurance };
import { formatSecToHM, formatSecToHMS } from './common.js';
const ENDURANCE = 'endurance';
const sizeType = ['Beginner', 'Intermediate', 'Expert'];
class Endurance {
    size;
    category = ENDURANCE;
    startTimes = [];
    winTimes = [];
    startPathnames = [];
    winPathnames = [];
    constructor(size, init) {
        this.size = size;
        Object.assign(this, init);
    }
    static isSizeType = (value) => {
        return sizeType.some(v => v === value);
    };
    recordStartTime() {
        this.startTimes.push(new Date().toISOString());
    }
    recordStartPathname(pathname) {
        this.startPathnames.push(pathname);
    }
    recordStart(pathname) {
        this.recordStartTime();
        this.recordStartPathname(pathname);
    }
    recordWinTime() {
        this.winTimes.push(new Date().toISOString());
        if (this.winTimes.length > 100) {
            this.winTimes.shift();
        }
    }
    recordWinPathname(pathname) {
        this.winPathnames.push(pathname);
        if (this.winPathnames.length > 100) {
            this.winPathnames.shift();
        }
    }
    recordWin(pathname) {
        this.recordWinTime();
        this.recordWinPathname(pathname);
    }
    isCorrectStartPathname(pathname) {
        return this.startPathnames.length === 0 ||
            !this.startPathnames.includes(pathname);
    }
    isCorrectWinPathname(pathname) {
        return this.startPathnames.includes(pathname) &&
            !this.winPathnames.includes(pathname);
    }
    getElapsedTime() {
        const start = new Date(this.startTimes[this.startPathnames.indexOf(this.winPathnames[0])]).getTime();
        const now = new Date().getTime();
        const recordTime = Math.trunc((now - start) / 1000);
        return recordTime;
    }
    getElapsedTimeHM(messages) {
        return formatSecToHM(this.getElapsedTime(), messages);
    }
    getRecordTime() {
        const start = new Date(this.startTimes[this.startPathnames.indexOf(this.winPathnames[0])]).getTime();
        const last = new Date(this.winTimes.slice(-1)[0]).getTime();
        const recordTime = Math.trunc((last - start) / 1000);
        return recordTime;
    }
    getRecordTimeHMS(messages) {
        return formatSecToHMS(this.getRecordTime(), messages);
    }
    getWins() {
        return this.winTimes.length;
    }
}
