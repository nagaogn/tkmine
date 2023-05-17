"use strict";
const ttsOption = { lang: 'ja' };
chrome.runtime.onMessage.addListener(request => {
    if (request.action === 'speak') {
        chrome.tts.speak(request.text, ttsOption);
    }
});
