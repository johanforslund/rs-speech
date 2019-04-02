let playPauseButton = document.getElementById('playPause');
let playing;
let currTabID;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  currTabID = tabs[0].id;
});

document.addEventListener('DOMContentLoaded', function(){
  chrome.runtime.getBackgroundPage(background => {
    playing = background.isPlaying(currTabID);
    playPauseButton.childNodes[0].innerHTML = playing ? "pause" : "play_arrow";
  });
});

playPauseButton.onclick = function(element) {
  chrome.runtime.sendMessage({ msg: "playPause", data: currTabID }, function(response) {
    playing = !playing;
    playPauseButton.childNodes[0].innerHTML = playing ? "pause" : "play_arrow";
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: `${playing ? 'startSpeech' : 'stopSpeech'}`}, function(response) {});
    });
  });
};
