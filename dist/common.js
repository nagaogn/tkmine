export { formatSecToHM, formatSecToHMS };
const formatSecToHM = (sec, messages) => {
    const h = Math.trunc(sec / 3600);
    const m = Math.trunc((sec % 3600) / 60);
    let result = h === 0 ? '' : messages.getMessage('notifyHours', { 'hours': h }, h);
    result += m === 0 ? '' : messages.getMessage('notifyMinutes', { 'minutes': m }, m);
    return result;
};
const formatSecToHMS = (sec, messages) => {
    const h = Math.trunc(sec / 3600);
    const m = Math.trunc((sec % 3600) / 60);
    const s = Math.trunc(sec % 60);
    let result = h === 0 ? '' : messages.getMessage('notifyHours', { 'hours': h }, h);
    result += m === 0 ? '' : messages.getMessage('notifyMinutes', { 'minutes': m }, m);
    result += s === 0 ? '' : messages.getMessage('notifySeconds', { 'seconds': s }, s);
    return result;
};
