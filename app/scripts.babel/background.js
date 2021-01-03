'use strict';

const translatorOnDeepLSite = (text) => {
  const url = `https://www.deepl.com/translator#en/zh/${encodeURIComponent(text)}`
  chrome.tabs.create({ url: url })
}


chrome.contextMenus.create({
  title: 'Translate with DeepL',
  type: 'normal',
  contexts: ['selection'],
  onclick: (info) => {
    const originalText = info.selectionText
    return translatorOnDeepLSite(text)
  }
})

