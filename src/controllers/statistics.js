"use strict";

const paths           = require("../../config/paths");
const config          = require(paths.config + 'config');
const statisticsModel = require(paths.models + 'statistics');
const controller      = require(paths.controllers + 'controller');

exports.index = function (req, res, next) {
	var response       = controller.response(req, res, next);
	response.view_path = './statistics/index';
	response.title     = 'Statistics';
    res.render(response.view_path, response);
};