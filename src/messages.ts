export { Messages, MessagesLoader };

interface Messages {
	[index: string]: {
		message: string;
	};
}

//TODO: こっちで値を持つようにする
class MessagesLoader {
	static load = async (lang: string = 'en') : Promise<Messages> => {
		const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
		const messages = await response.json();
		return messages;
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