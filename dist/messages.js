export { Messages };
class Messages {
    lang;
    message;
    constructor(lang, message) {
        this.lang = lang;
        this.message = message;
    }
    static create = async (lang = 'en') => {
        const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
        const message = await response.json();
        return new Messages(lang, message);
    };
}
