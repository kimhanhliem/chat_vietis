var Html = {};

Html.itemMessages = function(message){
	var html = '';
	if(message.type_sent == define.CUSTOMMER) {

		html += '<div class="item" data-time="' + message.created + '">';
			html += '<div class="img">';
				html += '<a href="#" style="background-color: ' + message.from.color + '">' + message.from.sub_name + '</a>';
				html += '<div class="time">' + message.created + '</div>';
			html += '</div>';
			html += '<div class="content">';
				html += '<div><div class="message first">' + message.message + '</div></div>';
			html += '</div>';
			html += '<div class="clear"></div>';
		html += '</div>';

	} else if (message.type_sent == define.SUPPORT){

		html += '<div class="item support_chat" data-time="' + message.created + '">';
			html += '<div class="img">';
				html += '<a href="#" style="background-color: ' + message.from.color + '">' + message.from.sub_name + '</a>';
				html += '<div class="time">' + message.created + '</div>';
			html += '</div>';
			html += '<div class="content">';
				html += '<div><div class="message first">' + message.message + '</div></div>';
			html += '</div>';
			html += '<div class="clear"></div>';
		html += '</div>';

	} else if (message.type_sent == define.CHATBOT){

		html += '<div class="item support_chat chatbot" data-time="' + message.created + '">';
			html += '<div class="img">';
				html += '<a href="#" style=""><i class="fa fa-android" aria-hidden="true"></i></a>';
				html += '<div class="time">' + message.created + '</div>';
			html += '</div>';
			html += '<div class="content">';
				html += '<div><div class="message first">' + message.message + '</div></div>';
			html += '</div>';
			html += '<div class="clear"></div>';
		html += '</div>';

	}
	return html;
}

Html.itemMessagesLast = function(message) {
	return '<div><div class="message">' + message.message + '</div></div>';
}

Html.itemListCustommer = function(custommer, active){
	
	var new_message = ((custommer.total_mesage && custommer.total_mesage.user > 0) || !custommer.support) ? 'new' : '';
	var active_custommer = (active) ? 'active' : '';
	var html = '';
	if (!custommer.support) {

		html += '<li class="item '+new_message+' '+active_custommer+'" id="list-item-'+custommer._id+'" data-time="'+custommer.timesteamp+'">';
			html += '<a href="/chats/index/' + custommer._id + '">';
			html += '<div class="img" style="background-color: ' + custommer.color + '">' + custommer.sub_name + '</div>';
			html += '<div class="content">';
				html += '<div class="name">' + custommer.full_name + '</div>';
				html += '<div class="tick">Tin nhắn chờ...</div>';
				html += '<div class="time">' + custommer.created + '</div>';
				html += '<div class="number">' + (custommer.total_mesage ? custommer.total_mesage.user : 0) + '</div>';
			html += '</div>';
			html += '<div class="clear"></div>';
			html += '</a>';
		html += '</li>';

	} else {

		html += '<li class="item '+new_message+' '+active_custommer+'" id="list-item-'+custommer._id+'" data-time="'+custommer.timesteamp+'">';
			html += '<a href="/chats/index/' + custommer._id + '">';
				html += '<div class="img" style="background-color: ' + custommer.color + '">' + custommer.sub_name + '</div>';
				html += '<div class="content">';
					html += '<div class="name">' + custommer.full_name + '</div>';
					html += '<div class="phone">' + custommer.phone + '</div>';
					html += '<div class="time">' + custommer.created + '</div>';
					html += '<div class="number">' + (custommer.total_mesage ? custommer.total_mesage.user : 0) + '</div>';
				html += '</div>';
				html += '<div class="clear"></div>';
			html += '</a>';
		html += '</li>';

	}
	return html;
}