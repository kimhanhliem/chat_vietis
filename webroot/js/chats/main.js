var ChatMain = {};
var socket   = io();
var typing   = false;
var lastTypingTime;
var TYPING_TIMER_LENGTH = 400;


var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;// Opera 8.0+
var isFirefox = typeof InstallTrigger !== 'undefined';// Firefox 1.0+
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);// Safari 3.0+ "[object HTMLElementConstructor]" 
var isIE = /*@cc_on!@*/false || !!document.documentMode;// Internet Explorer 6-11
var isEdge = !isIE && !!window.StyleMedia; // Edge 20+
var isChrome = !!window.chrome && !!window.chrome.webstore; // Chrome 1+
var isBlink = (isChrome || isOpera) && !!window.CSS; // Blink engine detection


ChatMain.allowNotify = function(){
	if (isIE) return;
	// Nếu trình duyệt không hỗ trợ thông báo
    if (!window.Notification){
    	
	}
	// Ngược lại trình duyệt có hỗ trợ thông báo
	else{
		// Gửi lời mời cho phép thông báo
        Notification.requestPermission(function (status) {
        	// Nếu không cho phép
            if (status === 'denied'){
            	
            }
            // Cho phép nhận thông báo
            else {
            	
            }
        });
	}
}

ChatMain.showNotify = function(data){
	if (isIE) return;
	var notify;
	// Nếu chưa cho phép thông báo
	if (Notification.permission == 'default'){
        
    } 
    // Đã cho phép hiển thị thông báo
    else {
    	// Tạo thông báo
        notify = new Notification(data.title, // Tiêu đề thông báo
            {
                body: data.body, // Nội dung thông báo
                icon: '/images/icon-chat.png', // Hình ảnh
                tag: data.link // Đường dẫn 
            }
        );
        // Thực hiện khi nhấp vào thông báo
        notify.onclick = function () {
            window.location.href = this.tag; // Di chuyển đến trang cho url = tag
        }
    }
}

ChatMain.playAudioIncoming = function(){
	if (isIE) return;
	$('#chatAudioIncoming')[0].play();
}

ChatMain.playAudioNotify = function(){
	if (isIE) return;
	$('#chatAudioNotify')[0].play();
}

ChatMain.typing = function(){
	$('.main-chat .form_send_message textarea').on('input', function(){
		var data = $Core.getSerializeForm($(this).closest('.form_send_message'));
		$Core.console(data, 'form');
		if(!typing) {
			typing = true;
			socket.emit('typing', data);
		}
		lastTypingTime = (new Date()).getTime();
		setTimeout(function () {
			var typingTimer = (new Date()).getTime();
			var timeDiff = typingTimer - lastTypingTime;
			if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
				socket.emit('stop_typing', data);
				typing = false;
			}
		}, TYPING_TIMER_LENGTH);
	});
}
ChatMain.typing();


ChatMain.scrollBottomListMessage = function(){
	var selectorMain = '.main-chat .main.list';
	var heightScroll = $(selectorMain).scrollTop();
	var height = $('.list-message', selectorMain).height();
	$(selectorMain).animate({ scrollTop: height }, 0);
}
ChatMain.scrollBottomListMessage();

ChatMain.keypressSendMessage = function(ele, event) {
	if (event.keyCode == 13) {
		if (!event.shiftKey) {
			$(ele).submit();
			return false;
		}
    }
    return true;
}

ChatMain.selectorChat = function(id){
	var selector = '#uid' + id;
	return $('.main-chat .main.list .list-message', selector);
}

ChatMain.setTyping = function(data){
	var selector = '#uid' + data.custommer_id;
	console.log(selector);
	$('.main-chat .main .typing', selector).html(data.user.full_name + ' đang nhập...');
}

ChatMain.setStopTyping = function(data){
	var selector = '#uid' + data.custommer_id;
	console.log(selector);
	$('.main-chat .main .typing', selector).html('');
}

ChatMain.checkMessageGroup = function(id, message){
	var selectorItemMessage = ChatMain.selectorChat(id).find('.item:last');
	var timeLast = selectorItemMessage.data('time');

	if (timeLast == message.created) {
		var conditionOne = selectorItemMessage.hasClass('support_chat') && message.type_sent == 'support';
		var conditionTwo = !selectorItemMessage.hasClass('support_chat') && message.type_sent == 'custommer';
		if (conditionOne || conditionTwo) {
			selectorItemMessage.find('.content').append(Html.itemMessagesLast(message));
			return true;
		}
	}
	return false;
}

ChatMain.showAlert = function(mgs){
	(mgs ? alert(mgs) : null);
}

ChatMain.sortListCustomer = function(id){
	tinysort('.sidebar-chat .list li.item', {order:'desc', attr:"data-time"});
}

/*
 * PROCESS SOCKET
 */
socket.io.on('connect_error', function(err) {
	$Core.console('Error connecting to server');
});

socket.on('connect', function(e) {
	$Core.console('connect');
});

socket.on('typingBroadcast', function (reponse) {
	$Core.console(reponse, 'reponse');
	if (reponse.status == 0){
		ChatMain.setTyping(reponse);
	}
});

socket.on('stopTypingBroadcast', function (reponse) {
	$Core.console(reponse, 'reponse');
	if (reponse.status == 0){
		ChatMain.setStopTyping(reponse);
	}
});

socket.on('stopTyping', function (reponse) {
	$Core.console(reponse, 'reponse');
	
});

socket.on('typing', function (reponse) {
	$Core.console(reponse, 'reponse');
	
});
/*
 * END: PROCESS SOCKET
 */