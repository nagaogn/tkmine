export { MessagesLoader };
class MessagesLoader {
    static loadMessages = async (lang = 'en') => {
        const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
        const message = await response.json();
        return message;
    };
}
