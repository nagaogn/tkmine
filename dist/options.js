export { setOptions, getOptions };
const setOptions = (options) => {
    chrome.storage.local.set({ options: options });
};
const getOptions = async () => {
    return await new Promise(resolve => {
        chrome.storage.local.get('options', result => resolve(result.options));
    });
};
