export { MessagesLoader };
class MessagesLoader {
    static load = async (lang = 'en') => {
        const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
        const messages = await response.json();
        return messages;
    };
    static replace = (message, replaceWords) => {
        let result = message;
        for (const key in replaceWords) {
            const regex = new RegExp(`\\$${key}\\$`, 'g');
            result = result.replace(regex, replaceWords[key].toString());
        }
        return result;
    };
}
