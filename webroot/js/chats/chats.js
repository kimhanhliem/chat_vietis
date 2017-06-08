var Chat = {};
ChatMain.allowNotify();

/*
 * PROCESS FORM
 */
Chat.removeNoMessage = function(eleParent){
	$('.no-message', eleParent).remove();
}

Chat.addListCustommer = function(custommer, active){
	if (custommer.length <= 0) return false;
	var html = Html.itemListCustommer(custommer, active);
	$('.sidebar-chat .list').prepend(html);
}

Chat.newMessage = function(ele){
	var data = $Core.getSerializeForm(ele);
	$Core.console(data, 'form newMessage');
	socket.emit('newMessage', data);
}

Chat.approvalSupport = function(id){
	if (confirm('Are you sure?')) {
		socket.emit('approvalSupport', {custommer: id, support: $UserId});
	}
	return false;
}

Chat.updateListCustommer = function(id, custommer){
	var selectItemListCurrent = $('#list-item-' + id, '.sidebar-chat .list');
	var active = (selectItemListCurrent.hasClass('active') ? true : false);
	selectItemListCurrent.remove();
	Chat.addListCustommer(custommer, active);
}
/*
 * END: PROCESS FORM
 */


/*
 * PROCESS SOCKET
 */
socket.on('addCustommerBroadcast', function (reponse) {
	$Core.console(reponse, 'reponse addCustommerBroadcast');
	if (reponse.status == 0) {
		ChatMain.playAudioIncoming();
		Chat.removeNoMessage('.sidebar-chat .list');
		ChatMain.showNotify({
			title: 'Có thành viên mới cần bạn support',
			body: reponse.userchat.full_name,
			tag: '/chats/index/' + reponse.userchat._id,
		});
		Chat.addListCustommer(reponse.userchat);
	}
});

socket.on('updateCustommerBroadcast', function (reponse) {
	$Core.console(reponse, 'reponse updateCustommerBroadcast');
});

socket.on('newMessage', function (reponse) {
	$Core.console(reponse, 'reponse newMessage');
	if (reponse.status == 0) {
		var message = reponse.data.message;
		var custommer = reponse.data.custommer;
		var id;
		if (message.type_sent == define.CUSTOMMER) {
			id = message.from._id;
			var action = false;
			if (message.to) {
				if (message.to._id == $UserId) {
					action = true;
				}
			} else {
				action = true;
			}

			if (action) {
				Chat.updateListCustommer(id, custommer);
				ChatMain.playAudioNotify();
				ChatMain.showNotify({
					title: 'Bạn có tin nhắn từ ' + message.from.full_name,
					body: message.message,
					tag: '/chats/index/' + id,
				});
			}
			
		} else if(message.type_sent == define.SUPPORT){
			
			$('.main-chat .form_send_message textarea').val('').focus();
			id = message.to._id;
			Chat.updateListCustommer(id, custommer);

		} else if(message.type_sent == define.CHATBOT){

			id = message.to._id;
			Chat.updateListCustommer(id, custommer);
			
		}

		
		
		ChatMain.sortListCustomer(id);
		var selectorListMessage = ChatMain.selectorChat(id);
		if (!ChatMain.checkMessageGroup(id, message)) {
			selectorListMessage.append(Html.itemMessages(message));
		}
		ChatMain.scrollBottomListMessage();
	} else {
		if (reponse.focus) $(reponse.focus, '.main-chat .form_input').focus();
		if (reponse.message) ChatMain.showAlert(reponse.message);
	}
});

socket.on('approvalSupport', function(reponse){
	$Core.console(reponse, 'reponse approvalSupport');
	if (reponse.status == 0) {
		location.reload();
	} else {
		if (reponse.message) ChatMain.showAlert(reponse.message);
	}
});

socket.on('approvalSupportBroadcast', function(reponse){
	$Core.console(reponse, 'reponse approvalSupportBroadcast');

});

/*
 * END: PROCESS SOCKET
 */