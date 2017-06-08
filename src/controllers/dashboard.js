"use strict";

const paths        = require("../../config/paths");
const config       = require(paths.config + 'config');
const controller = require(paths.controllers + 'controller');

exports.index = function (req, res, next) {
	var response       = controller.response(req, res, next);
	response.view_path = './dashboard/index';
	response.title     = 'Dashboard';
    res.render(response.view_path, response);
};