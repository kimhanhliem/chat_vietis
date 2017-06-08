var protocol = window.location.protocol == "https:" ? "https:" : "http:";
var host = protocol + '//34.211.58.166:3000/chats/frame';
// var host = protocol + '//172.16.80.139:3000/chats/frame';
var ChatsLoader = {
	createIFrame: function(){
		/* create iframe */
		var html = '';
		html += '<div sandbox="allow-same-origin allow-scripts allow-popups allow-forms" class="wrapper_chat_vietis" style="display: block; margin: 0px; padding: 0px; border: 0px; background-color: transparent; z-index: 16000001; position: fixed; bottom: 0px; overflow: hidden; right: 10px; width: 390px; height: 511px;">';
			html += '<iframe class="iframe_chat_vietis" frameborder="0" src="' + host + '" style="border: none; background-color: transparent; vertical-align: text-bottom; position: relative; width: 100%; height: 100%; margin: 0px; overflow: hidden;">';
			html += '</iframe>';	
		html += '</div>';
		$('body').append(html);
	}
};

jQuery(document).ready(function() {
    ChatsLoader.createIFrame();
});

(function (window, undefined) {
    var frame, lastKnownFrameHeight = 0, maxFrameLoadedTries = 5, maxResizeCheckTries = 20;
    addEvent(window, 'resize', resizeFrame);
    var iframeCheckInterval = window.setInterval(function () {
        maxFrameLoadedTries--;
        var frames = document.getElementsByClassName('iframe_chat_vietis');
        if (maxFrameLoadedTries == 0 || frames.length) {
            clearInterval(iframeCheckInterval);
            frame = frames[0];
            addEvent(frame, 'load', resizeFrame);
            var resizeCheckInterval = setInterval(function () {
                resizeFrame();
            }, 1000);
            resizeFrame();
        }
    }, 500);
    function resizeFrame() {
        if (frame) {
            var frameHeight = frame.contentWindow.document.getElementById('main-chat').scrollHeight;
            if (frameHeight !== lastKnownFrameHeight) {
                lastKnownFrameHeight = frameHeight;
                frame.closest('.wrapper_chat_vietis').setAttribute('height', lastKnownFrameHeight);
                frame.closest('.wrapper_chat_vietis').style.height = frameHeight + 'px';
            }
        }
    }
    function addEvent(elem, event, fn) {
        if (elem.addEventListener) {
            elem.addEventListener(event, fn, false);
        } else {
            elem.attachEvent("on" + event, function () {
                return (fn.call(elem, window.event));
            });
        }
    }
})(window);