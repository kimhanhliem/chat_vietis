const path    = require('path');
const dirname = path.dirname;
const DS      = path.sep;

exports.root            = dirname(__dirname) + DS;
exports.config          = exports.root + 'config' + DS;
exports.config_module   = exports.config + 'modules' + DS;
exports.middlewares     = exports.config + 'middlewares' + DS;
exports.config_passport = exports.config_module + 'passport' + DS;
exports.app             = exports.root + 'src' + DS;
exports.controllers     = exports.app + 'controllers' + DS;
exports.controllersApi  = exports.controllers + 'api' + DS;
exports.models          = exports.app + 'models' + DS;
exports.views           = exports.app + 'views' + DS;
exports.sockets         = exports.app + 'sockets' + DS;
exports.utils           = exports.root + 'utils' + DS;
exports.webroot         = exports.root + 'webroot' + DS;
exports.webroot_img     = exports.webroot + 'images' + DS;


