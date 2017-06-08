var $Core = {};

$Core.debug = true;

$Core.console = function(data, type){
	if ($Core.debug) {
		var type = (type != null) ? type : 'client';
		console.log(type + ': ');
		console.log(data);
		console.log('-------------------------------------');
	}
}

$Core.getSerializeForm = function(form){
	var data = {};
	$(form).serializeArray().map(function(x){
		data[x.name] = x.value;
	});
	return data;
}