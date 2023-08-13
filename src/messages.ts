export { MessagesLoader };

interface Messages {
	[index: string]: {
		message: string;
	};
}

class MessagesLoader {
	static load = async (lang: string = 'en') : Promise<Messages> => {
		const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
		const message = await response.json();
		return message;
	}
}