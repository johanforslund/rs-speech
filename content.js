const synth = window.speechSynthesis;
let englishVoices = [];

document.addEventListener('DOMContentLoaded',function(){
  chrome.runtime.sendMessage({msg: "newContent"}, function(response) {});
});

const observer = new MutationObserver(mutations => {
  mutations.map(mutation => {
    if (mutation.addedNodes.length > 0) {
      speak(mutation.addedNodes[0].childNodes[5].childNodes[3].innerText);
    }
  });
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'startSpeech') {
    startSpeech();
  }
  if (msg.action == 'stopSpeech') {
    stopSpeech();
  }
  if (msg.action == 'reset') {
    stopSpeech();
  }
});

function startSpeech() {
  const voices = synth.getVoices();
  console.log("START");

  englishVoices = voices.filter(voice => {
    return voice.lang === 'en-GB' || voice.lang === 'en-US';
  });

  const target = document.querySelector("#c-list");
  const config = { childList: true };
  observer.observe(target, config);
}

function stopSpeech() {
  console.log("STOP");
  observer.disconnect();
  stop();
}

function speak(text) {
  const utterThis = new SpeechSynthesisUtterance(text);
  randomVoice(utterThis);
  synth.speak(utterThis);
}

function stop()
{
  synth.cancel();
}

function randomVoice(utterThis) {
  const randomIndex = Math.floor(Math.random() * englishVoices.length);
  utterThis.voice = englishVoices[randomIndex];
  utterThis.pitch = Math.random() * (1.3 - 0.7) + 0.7;
}
