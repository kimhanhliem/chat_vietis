var locutus = require('locutus');

exports.sha1 = function(str){
   return locutus.php.strings.sha1(str);
}