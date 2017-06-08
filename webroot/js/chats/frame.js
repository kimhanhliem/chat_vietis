var ChatFrame = {};
/*
 * PROCESS FORM
 */
ChatFrame.minmaximize = function(ele){
	var wrapper_chat = $(ele).closest('.wrapper-chat');
	var data = {};
	if (wrapper_chat.hasClass('minimize')) {
		data.type = 'maximize';
		wrapper_chat.addClass('maximize').removeClass('minimize');
	} else {
		data.type = 'minimize';
		wrapper_chat.addClass('minimize').removeClass('maximize');
	}
	socket.emit('minmaximize', data);
}

ChatFrame.switchFormListFrame = function(type){
	var ele = $('.main-chat .main');
	if (type == 'form') {
		ele.removeClass('list').addClass('form').find('.error').text('');
	} else {
		ele.removeClass('form').addClass('list').find('.error').text('');
	}
}

ChatFrame.appendMessage = function(message, type){
	var ele = $('.main-chat .messages');
	if (type == 'error') {
		ele.html('<div class="message_error">' + message + '</div>');
	} else if(type == 'success'){
		ele.html('<div class="message_success">' + message + '</div>');
	} else {
		ele.html('');
	}
}

ChatFrame.registerUser = function(ele){
	ChatFrame.appendMessage();
	var data = $Core.getSerializeForm(ele);
	$Core.console(data, 'form');
	socket.emit('addCustommer', data);
}

ChatFrame.newMessage = function(ele){
	ChatFrame.appendMessage();
	var data = $Core.getSerializeForm(ele);
	$Core.console(data, 'form');
	socket.emit('newMessage', data);
}
/*
 * END: PROCESS FORM
 */


/*
 * PROCESS SOCKET
 */
socket.on('addCustommer', function (reponse) {
	$Core.console(reponse, 'reponse');
	ChatFrame.appendMessage();
	if (reponse.status == 0) {
		$('.wrapper-chat').attr('id', 'uid' + reponse.userchat._id);
		ChatFrame.switchFormListFrame('list');
		ChatMain.allowNotify();
	} else {
		if (reponse.message) ChatFrame.appendMessage(reponse.message, 'error');
		if (reponse.focus) $(reponse.focus, '.form_register').focus();
	}
});

socket.on('updateCustommer', function (reponse) {
	$Core.console(reponse, 'reponse');
});

socket.on('newMessage', function (reponse) {
	$Core.console(reponse, 'reponse');
	if (reponse.status == 0) {
		var message = reponse.data.message;
		var id;
		var selectorListMessage;
		if (message.type_sent == define.CUSTOMMER) {
			id = message.from._id;
			$('.main-chat .form_send_message textarea').val('').focus();
			selectorListMessage = ChatMain.selectorChat(id);

		} else if(message.type_sent == define.SUPPORT){

			id = message.to._id;
			selectorListMessage = ChatMain.selectorChat(id);
			if (selectorListMessage.length) {
				ChatMain.playAudioNotify();
				ChatMain.showNotify({
					title: 'Bạn có tin nhắn từ ' + message.from.full_name,
					body: message.message,
					tag: '/chats/frame',
				});
			}

		} else if(message.type_sent == define.CHATBOT){

			id = message.to._id;
			selectorListMessage = ChatMain.selectorChat(id);
			if (selectorListMessage.length) {
				ChatMain.playAudioNotify();
				ChatMain.showNotify({
					title: 'Bạn có tin nhắn từ hệ thống tự động',
					body: message.message,
					tag: '/chats/frame',
				});
			}

		}
		
		if (!ChatMain.checkMessageGroup(id, message)) {
			selectorListMessage.append(Html.itemMessages(message));
		}
		
		ChatMain.scrollBottomListMessage();
	} else if(reponse.status == 403) {
		ChatFrame.switchFormListFrame('form');
		if (reponse.focus) $(reponse.focus, '.form_register').focus();
		if (reponse.message) ChatFrame.appendMessage(reponse.message, 'error');
	} else {
		if (reponse.focus) $(reponse.focus, '.main-chat .form_input').focus();
		if (reponse.message) ChatFrame.appendMessage(reponse.message, 'error');
	}
});

socket.on('approvalSupportBroadcast', function(reponse){
	$Core.console(reponse, 'reponse');
	if (reponse.status == 0) {
		var id = reponse.user._id;
		selectorListMessage = ChatMain.selectorChat(id);
		if (selectorListMessage.length) {
			socket.emit('updateInfoCustommer', {custommer: id});
		}
	}
});

socket.on('updateInfoCustommer', function(reponse){
	$Core.console(reponse, 'reponse');
	if (reponse.status == 0) {
		location.reload();
	}
});
/*
 * END: PROCESS SOCKET
 */