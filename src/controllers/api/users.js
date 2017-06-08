"use strict";

const paths      = require("../../../config/paths");
const config     = require(paths.config + 'config');
const crypt      = require(paths.utils + 'crypt');
const controller = require(paths.controllers + 'controller');
const usersModel = require(paths.models + 'users');
const usersTable = new usersModel.Schema("users").model;

exports.changePassword = function(req, res, next) {
    var response = controller.responseAPI(req, res, next);
    var data     = req.body;
    var id       = req.user.id;
    if(data.id){
        usersTable.findOne({'_id':data.id}, function (err, user) {
            if (err || !user) {
                response.message = 'Thành viên không tồn tại.';
                response.status = 1;
            }
            if (req.originalMethod == 'POST') {
                req.checkBody(usersModel.validatechangePassword(data, user));
                req.getValidationResult().then(function(result){
                    var errors = result.array();
                    if (result.isEmpty()) {
                        user.password = crypt.sha1(data.password);
                        user.save(function(err, user){
                            if (user) {
                                if (id == data.id) req.logout();
                                response.status  = 0;
                                req.flash('success', 'Đổi mật khẩu thành công!');
                            } else {
                                response.status  = 1;
                                response.message = 'Đổi mật khẩu không thành công!';
                            }
                            res.json(response);
                        });
                    } else {
                        response.focus   = '[name="' + errors[0].param + '"]';
                        response.message = errors[0].msg;
                        response.status  = 1;
                        res.json(response);
                    }
                });
            } else {
                res.json(response);
            }
        });
    } else {
        res.json(response);
    }
}