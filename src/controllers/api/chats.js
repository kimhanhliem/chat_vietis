"use strict";

const paths      = require("../../../config/paths");
const config     = require(paths.config + 'config');
const crypt      = require(paths.utils + 'crypt');
const controller = require(paths.controllers + 'controller');
const chatsModel = require(paths.models + 'chats');
const chatsTable = new chatsModel.Schema("chats").model;