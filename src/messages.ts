export { MessagesLoader };

const languageType = ['en', 'ja'] as const;

type LanguageType = typeof languageType[number];

interface Messages {
	[key: string]: {
		message: string;
	};
}

class MessagesLoader {
	constructor(
		public messages: Messages,
		public language: string
	) {}

	static isLanguageType = (value: string): value is LanguageType => {
		return languageType.some(v => v.split('-')[0] === value);
	}

	static init = async (lang: string = 'en') => {
		return new this(await this.load(lang), lang);
	}

	protected static load = async (lang: string = 'en') : Promise<Messages> => {
		let result: Messages = {};
		if(this.isLanguageType(lang)) {
			const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
			result = await response.json();
		} else {
			console.error(`Invalid LanguageType: ${lang}`);
		}
		return result;
	}

	public getMessage = (messageName: string, substitutions?: { [key: string]: string | number }, count?: number): string => {
		const name = count === undefined || count === 1 ? messageName : messageName + 'Plural';
		let result = this.messages[name].message;
		for (const key in substitutions) {
			const regex = new RegExp(`\\$${key}\\$`, 'g');
			result = result.replace(regex, substitutions[key].toString());
		}
		return result;
	}
}