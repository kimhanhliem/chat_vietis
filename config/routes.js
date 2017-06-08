'use strict';
/**
 * Module dependencies.
 */




/**
 * include config
 */
const paths  = require("./paths");
const config = require(paths.config + "config");
const auth = require(paths.middlewares + 'authorization');

/**
 * Controllers
 */
const dashboard  = require(paths.controllers + 'dashboard');
const users      = require(paths.controllers + 'users');
const usersApi   = require(paths.controllersApi + 'users');
const chats      = require(paths.controllers + 'chats');
const chatsApi   = require(paths.controllersApi + 'chats');
const statistics = require(paths.controllers + 'statistics');
const controller = require(paths.controllers + 'controller');

const loginRedirect = {
	successRedirect: '/',
	failureRedirect: '/users/login',
	failureFlash: 'Username or password is incorrect!',
	successFlash: 'Login success!'
};

module.exports = function(app, passport){
	app.all('/', auth.requiresLogin, dashboard.index);

	/* User */
		/* WEB */
		app.all('/users/create-admin', users.createAdmin);
		app.get('/users/login', users.login).post('/users/login', passport.authenticate('local', loginRedirect));
		app.all('/users/logout', users.logout); 
		app.all('/users/register', auth.requiresLogin, users.register);
		app.all('/users/forgot', users.forgot);
		app.all('/users/add', auth.requiresLogin, users.add);
		app.all('/users/profile', auth.requiresLogin, users.profile);

		app.all('/users/edit', auth.requiresLogin, users.edit);
		app.all('/users/edit/:id', auth.requiresLogin, users.edit);

		app.all('/users/detail', auth.requiresLogin, users.detail);
		app.all('/users/detail/:id', auth.requiresLogin, users.detail);

		app.all('/users/delete', auth.requiresLogin, users.delete);
		app.all('/users/delete/:id', auth.requiresLogin, users.delete);	

		app.all('/users', auth.requiresLogin, users.index);
		app.all('/users/index', auth.requiresLogin, users.index);

		/* API */
		app.all('/api/users/change-password', auth.requiresLogin, usersApi.changePassword);
	/* END: User */

	/* Chats */
		/* WEB */
		app.all("/chats", auth.requiresLogin, chats.index);
		app.all("/chats/index", auth.requiresLogin, chats.index);
		app.all("/chats/index/:id", auth.requiresLogin, chats.index);
		app.all("/chats/frame", chats.frame);
		app.all("/chats/test", auth.requiresLogin, chats.test);

		/* API */
		
	/* END: Chats */

	/* Statistics */
	app.all("/statistics/index", auth.requiresLogin, statistics.index);
	/* END: Statistics */

	app.use(function(req, res, next){
		var response = controller.response(req, res, next);
		response.url = req.originalUrl;
		
		res.status(404);
		if (req.accepts('html')) {
			res.render('./error/404', response);
			return;
		}

		if (req.accepts('json')) {
			res.send({ error: 'Not found' });
			return;
		}

		res.type('txt').send('Not found');
	});
}
