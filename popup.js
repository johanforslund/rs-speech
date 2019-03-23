let playPauseButton = document.getElementById('playPause');
let playing;

document.addEventListener('DOMContentLoaded',function(){
  chrome.runtime.getBackgroundPage(background => {
    playing = background.isPlaying();
    playPauseButton.childNodes[0].innerHTML = playing ? "pause" : "play_arrow";
  });
});

playPauseButton.onclick = function(element) {
  chrome.extension.sendMessage({ msg: "playPause" }, function(response) {
    playing = !playing;
    playPauseButton.childNodes[0].innerHTML = playing ? "pause" : "play_arrow";
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: `${playing ? 'startSpeech' : 'stopSpeech'}`}, function(response) {});
    });
  });
};
