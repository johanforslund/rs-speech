let playButton = document.getElementById('play');
let stopButton = document.getElementById('stop');

playButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "startSpeech"}, function(response) {});
  });
};

stopButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "stopSpeech"}, function(response) {});
  });
};
