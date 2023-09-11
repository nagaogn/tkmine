export { ENDURANCE, EnduranceStatus };
import { MessagesLoader } from './messages.js';
import { formatSecToHM, formatSecToHMS } from './common.js';

const ENDURANCE = 'endurance' as const;

const sizeType = ['Beginner', 'Intermediate', 'Expert'] as const;

type SizeType = typeof sizeType[number];

class EnduranceStatus {
	category: string = ENDURANCE;
	startTimes: string[] = [];
	winTimes: string[] = [];
	startPathnames: string[] = [];
	winPathnames: string[] = [];

	constructor(
		public size: SizeType,
		init?: Partial<EnduranceStatus>
	) {
		Object.assign(this, init);
	}

	static isSizeType = (value: string): value is SizeType => {
		return sizeType.some(v => v === value);
	}
	
	protected recordStartTime() {
		this.startTimes.push(new Date().toISOString());// NOTE: Date型のままだと保存できない
	}

	protected recordStartPathname(pathname: string) {
		this.startPathnames.push(pathname);
	}

	public recordStart(pathname: string) {
		this.recordStartTime();
		this.recordStartPathname(pathname);
	}

	protected recordWinTime() {
		this.winTimes.push(new Date().toISOString());
		if (this.winTimes.length > 100) {
			this.winTimes.shift();
		}
	}

	protected recordWinPathname(pathname: string) {
		this.winPathnames.push(pathname);
		if (this.winPathnames.length > 100) {
			this.winPathnames.shift();
		}
	}

	public recordWin(pathname: string) {
		this.recordWinTime();
		this.recordWinPathname(pathname);
	}

	public isCorrectStartPathname(pathname: string) {
		return this.startPathnames.length === 0 ||
		!this.startPathnames.includes(pathname);
	}

	public isCorrectWinPathname(pathname: string) {
		return this.startPathnames.includes(pathname) &&
		!this.winPathnames.includes(pathname);
	}

	public getElapsedTime() {
		const start = new Date(this.startTimes[
			this.startPathnames.indexOf(this.winPathnames[0])
		]).getTime();
		const now = new Date().getTime();
		const recordTime = Math.trunc((now - start) / 1000);
		return recordTime;
	}

	public getElapsedTimeHM(messages: MessagesLoader) {
		return formatSecToHM(this.getElapsedTime(), messages);
	}

	public getRecordTime() {
		const start = new Date(this.startTimes[
			this.startPathnames.indexOf(this.winPathnames[0])
		]).getTime();
		const last = new Date(this.winTimes.slice(-1)[0]).getTime();
		const recordTime = Math.trunc((last - start) / 1000);
		return recordTime;
	}

	public getRecordTimeHMS(messages: MessagesLoader) {
		return formatSecToHMS(this.getRecordTime(), messages);
	}

	public getWins() {
		return this.winTimes.length;
	}
}
