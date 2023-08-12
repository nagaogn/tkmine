export { Message, Messages };

interface Message {
	[index: string]: {
		message: string;
	};
}

class Messages {
	protected constructor(
		public lang: string,
		public message: Message
	) {}

	static create = async (lang: string = 'en') : Promise<Messages> => {
		const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
		const message = await response.json();
		return new Messages(lang, message);
	}
}