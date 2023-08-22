export { MessagesLoader };
const languageType = ['en', 'ja'];
class MessagesLoader {
    static isLanguageType = (value) => {
        return languageType.some(v => v.split('-')[0] === value);
    };
    static load = async (lang = 'en') => {
        let result = {};
        if (MessagesLoader.isLanguageType(lang)) {
            const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
            result = await response.json();
        }
        else {
            console.error(`Invalid LanguageType: ${lang}`);
        }
        return result;
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
