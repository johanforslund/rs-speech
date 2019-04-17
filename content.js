const synth = window.speechSynthesis;
let englishVoices = [];
let activeVoiceFromList = null;

let activeVoice = null;
let maximumVoices = 10;

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.activeVoice) {
    activeVoice = changes.activeVoice.newValue;
    setup();
  }
  if (changes.maximumVoices) {
    maximumVoices = changes.maximumVoices.newValue;
    setup();
  }
});

setup();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = setup;
}

const observer = new MutationObserver(mutations => {
  mutations.map(mutation => {
    if (mutation.addedNodes.length > 0) {
      speak(mutation.addedNodes[0].childNodes[5].childNodes[3].innerText);
    }
  });
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'startSpeech') {
    sendResponse({message: "Started"});

    const target = document.querySelector("#c-list");
    const config = { childList: true };
    observer.observe(target, config);
  }
  if (msg.action == 'stopSpeech') {
    observer.disconnect();
    stop();
    sendResponse({message: "Stopped"});
  }
  if (msg.action == 'setup') {
    console.log("APAN");
    setup();
  }
});

function speak(text) {
  const utterThis = new SpeechSynthesisUtterance(text);
  if (activeVoice === null) {
    randomVoice(utterThis);
  } else {
    utterThis.voice = activeVoiceFromList[0];
  }
  synth.speak(utterThis);
}

function stop()
{
  synth.cancel();
}

function randomVoice(utterThis) {
  const randomIndex = Math.floor(Math.random() * englishVoices.length);
  utterThis.voice = englishVoices[randomIndex];
  utterThis.pitch = Math.random() * (1.2 - 0.8) + 0.7;
}

function setup() {
  const voices = synth.getVoices();
  chrome.storage.sync.get(['activeVoice', 'maximumVoices'], function(data) {
    maximumVoices = data.maximumVoices;
    activeVoice = data.activeVoice;

    if (activeVoice == null) {
      englishVoices = voices.filter(voice => {
        return voice.lang === 'en-GB' || voice.lang === 'en-US';
      });
    } else {
      activeVoiceFromList = voices.filter(voice => {
        return voice.name === activeVoice;
      });
    }
  });
}
