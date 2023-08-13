export { formatSecToHM, formatSecToHMS };

const formatSecToHM = (sec: number) => {
	const h = Math.trunc(sec / 3600);
	const m = Math.trunc((sec % 3600) / 60);
	let result = h === 0 ? '' : `${h}時間`;
	result += m === 0 ? '' : `${m}分`;
	return result;
}

const formatSecToHMS = (sec: number) => {
	const h = Math.trunc(sec / 3600);
	const m = Math.trunc((sec % 3600) / 60);
	const s = Math.trunc(sec % 60);
	let result = h === 0 ? '' : `${h}時間`;
	result += m === 0 ? '' : `${m}分`;
	result += s === 0 ? '' : `${s}秒`;
	return result;
}
