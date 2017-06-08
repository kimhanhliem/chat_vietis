/**
 * Module dependencies.
 */
const passport        = require('passport');
const express         = require('express');
const app             = express();

/**
 * include config
 */
const paths          = require("./config/paths");
const config         = require(paths.config + "config");
const configRoutes   = require(paths.config + "routes");
const configServer   = require(paths.config + "server");
const configSocket   = require(paths.config + "socket");
const configPassport = require(paths.config_module + "passport");
const configExpress  = require(paths.config_module + "express");
const configMongoose = require(paths.config_module + "mongoose");

module.exports = app;

configPassport(passport);
configExpress.configExpress(app, passport);
var express_session = configExpress.configSession(app, passport);
configRoutes(app, passport);
configMongoose(app, passport);
configSocket.setupsocket(express_session, configServer(app, passport));