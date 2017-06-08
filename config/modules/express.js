'use strict';
/**
 * Module dependencies.
 */
const ejs              = require('ejs');
const express_layouts  = require('express-ejs-layouts');
const logger           = require('morgan');
const bodyParser       = require('body-parser');
const methodOverride   = require('method-override');
const express          = require('express');
const expressValidator = require('express-validator');
const errorhandler     = require('errorhandler');
const favicon          = require('serve-favicon');
const cookieParser     = require('cookie-parser');
const session          = require('express-session');
const flash            = require('express-flash');
const env              = process.env.NODE_ENV || 'development';

/**
 * include config
 */
const paths    = require("../paths");
const config   = require(paths.config + "config");
const customValidator = require(paths.config_module + "validator");

var cookieParserConfig = cookieParser();
var sessionConfig = session({
	secret: config.session_secret,
	resave: true,
	saveUninitialized: true,
	cookie: {
		secure: false,
		maxAge: (3600000 * 24) * 14, // 2 week
	}
});

/**
 * Expose
 */
exports.configExpress = function (app, passport) {
    // create App
	app.engine('html', ejs.renderFile);
	app.set('view engine', 'ejs');
	app.set('views', paths.views);
	app.set('layout', 'layout/layout');
	app.set("layout extractScripts", true);
	app.set("layout extractStyles", true);
	app.set("layout extractMetas", true);
	app.set("layout extractTitles", true);
	app.set('port', config.port);
	app.set('path_model', paths.models);
	app.use(express_layouts);
	app.use(logger('dev'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(bodyParser.text({ type: 'text/html' }));
	app.use(expressValidator(customValidator()));
	app.use(methodOverride('X-HTTP-Method-Override'));
	
	app.use(express.static(paths.webroot));
	app.use(errorhandler());
	app.use(favicon(paths.webroot_img + 'favicon.ico'));

	
};

exports.configSession = function(app, passport) {
	app.use(cookieParserConfig);
	app.use(sessionConfig);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	return sessionConfig;
}
