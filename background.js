let playingIDs = {};

chrome.runtime.onInstalled.addListener(function() {
   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
     chrome.declarativeContent.onPageChanged.addRules([{
       conditions: [new chrome.declarativeContent.PageStateMatcher({
         pageUrl: {hostEquals: 'reddit-stream.com'},
       })
       ],
           actions: [new chrome.declarativeContent.ShowPageAction()]
     }]);
   });
 });

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse){
       if(request.msg == "playPause") {
         playingIDs[request.data] = !playingIDs[request.data];
         sendResponse({message: "PlayPaused"});
       }
   }
);

function isPlaying(id) {
  return playingIDs[id];
}
