import { MessagesLoader } from "./messages.js";
export { formatSecToHM, formatSecToHMS };
const formatSecToHM = (sec, messages) => {
    const h = Math.trunc(sec / 3600);
    const m = Math.trunc((sec % 3600) / 60);
    let result = h === 0 ? '' : MessagesLoader.replace(messages['notifyHours'].message, { 'hours': h });
    result += m === 0 ? '' : MessagesLoader.replace(messages['notifyMinutes'].message, { 'minutes': m });
    return result;
};
const formatSecToHMS = (sec, messages) => {
    const h = Math.trunc(sec / 3600);
    const m = Math.trunc((sec % 3600) / 60);
    const s = Math.trunc(sec % 60);
    let result = h === 0 ? '' : MessagesLoader.replace(messages['notifyHours'].message, { 'hours': h });
    result += m === 0 ? '' : MessagesLoader.replace(messages['notifyMinutes'].message, { 'minutes': m });
    result += s === 0 ? '' : MessagesLoader.replace(messages['notifySeconds'].message, { 'seconds': m });
    return result;
};
