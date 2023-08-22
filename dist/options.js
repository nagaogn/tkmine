export { OptionsManager };
class OptionsManager {
    static set = (options) => {
        chrome.storage.local.set({ options: options });
    };
    static get = async () => {
        return await new Promise(resolve => {
            chrome.storage.local.get('options', result => resolve(result.options));
        });
    };
}
