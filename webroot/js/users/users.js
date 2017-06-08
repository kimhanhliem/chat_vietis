var $Users = {};

$Users.changePassword = function(ele) {
	var data = $(ele).serializeArray();
	$.ajax({
		type: "POST",
		url: '/api/users/change-password',
		data: data,
		success: function(response){
			if (response.status == 0) {
				location.reload();
			} else {
				if (response.message) {
					alert(response.message);
				}
				if (response.focus) {
					$('#change_password ' + response.focus).focus();
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {}
	});
}