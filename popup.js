let playPauseButton = document.getElementById('playPause');
let playing = false;

playPauseButton.onclick = function(element) {
  playing = !playing;
  playPauseButton.childNodes[0].innerHTML = playing ? "pause" : "play_arrow";
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: `${playing ? 'startSpeech' : 'stopSpeech'}`}, function(response) {});
  });
};
