let voiceSelect = document.getElementById("voiceSelect");
let maxVoicesInput = document.getElementById("maxvoices");
let synth = window.speechSynthesis;

document.getElementById("randomvoices").addEventListener("click", handleRandomVoices);
document.getElementById("save").addEventListener("click", onSave);

let randomVoicesActive = true;
let activeVoice = null;
let maximumVoices = 10;

chrome.storage.sync.get(['activeVoice', 'maximumVoices'], function(data) {
  activeVoice = data.activeVoice;
  console.log(activeVoice);
  maximumVoices = data.maximumVoices;
  if (activeVoice === null) {
    document.getElementById("randomvoices").checked = true;
  } else {
    document.getElementById("randomvoices").checked = false;
  }

  maxVoicesInput.value = maximumVoices;

  handleRandomVoices();
});

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function handleRandomVoices() {
  randomVoicesActive = document.getElementById("randomvoices").checked;

  if (randomVoicesActive) {
    voiceDropdown.style.display = 'none';
    activeVoice = null;
  } else {
    voiceDropdown.style.display = 'block';
    activeVoice = -1;
  }
}

function populateVoiceList() {
  const voices = synth.getVoices();

  chrome.storage.sync.get(['activeVoice'], function(data) {
    for(i = 0; i < voices.length ; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
        //option.selected = true;
      }

      if(voices[i].name === data.activeVoice) {
        option.selected = true;
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelect.appendChild(option);
    }
  });
}

function onSave() {
  if (activeVoice !== null) {
    activeVoice = document.getElementById("voiceSelect").selectedOptions[0].getAttribute('data-name');
  }

  maximumVoices = maxVoicesInput.value;
  maximumVoices = parseInt(maximumVoices, 10) || 10;
  maxVoicesInput.value = maximumVoices;

  chrome.storage.sync.set({activeVoice: activeVoice, maximumVoices: maximumVoices}, function() {});

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'setup'}, function(response) {});
  });
}
