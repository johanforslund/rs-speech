let playing = false;

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

chrome.extension.onMessage.addListener(
   function(request, sender, sendResponse){
       if(request.msg == "playPause") {
         playing = !playing;
       }
   }
);

function isPlaying() {
  return playing;
}
