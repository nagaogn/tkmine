export { MessagesLoader };
const languageType = ['en', 'ja'];
class MessagesLoader {
    messages;
    language;
    constructor(messages, language) {
        this.messages = messages;
        this.language = language;
    }
    static isLanguageType = (value) => {
        return languageType.some(v => v.split('-')[0] === value);
    };
    static init = async (lang = 'en') => {
        return new this(await this.load(lang), lang);
    };
    static load = async (lang = 'en') => {
        let result = {};
        if (this.isLanguageType(lang)) {
            const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
            result = await response.json();
        }
        else {
            console.error(`Invalid LanguageType: ${lang}`);
        }
        return result;
    };
    getMessage = (messageName, substitutions, count) => {
        const name = count === undefined || count === 1 ? messageName : messageName + 'Plural';
        let result = this.messages[name].message;
        for (const key in substitutions) {
            const regex = new RegExp(`\\$${key}\\$`, 'g');
            result = result.replace(regex, substitutions[key].toString());
        }
        return result;
    };
}
