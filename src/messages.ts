export { Messages, MessagesLoader };

const languageType = ['en', 'ja'] as const;

type LanguageType = typeof languageType[number];

interface Messages {
	[index: string]: {
		message: string;
	};
}

//TODO: こっちで値を持つようにする
class MessagesLoader {
	static isLanguageType = (value: string): value is LanguageType => {
		return languageType.some(v => v.split('-')[0] === value);
	}

	static load = async (lang: string = 'en') : Promise<Messages> => {
		let result = {};
		if(MessagesLoader.isLanguageType(lang)) {
			const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
			result = await response.json();
		} else {
			console.error(`Invalid LanguageType: ${lang}`);
		}
		return result;
	}

	//TODO: 第一引数をmessageNameにする?
	static replace = (message: string, replaceWords: { [key: string]: string | number }): string => {
		let result = message;
		for (const key in replaceWords) {
			const regex = new RegExp(`\\$${key}\\$`, 'g');
			result = result.replace(regex, replaceWords[key].toString());
		}
		return result;
	}
}