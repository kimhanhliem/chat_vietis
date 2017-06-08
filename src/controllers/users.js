"use strict";

const paths      = require("../../config/paths");
const config     = require(paths.config + 'config');
const define     = require(paths.config + 'define');
const crypt      = require(paths.utils + 'crypt');
const controller = require(paths.controllers + 'controller');

const usersModel = require(paths.models + 'users');
const usersTable = new usersModel.Schema("users").model;

/* controller login */
exports.login = function (req, res, next) {
    if (req.isAuthenticated()) { return res.redirect('/'); }
    var response = controller.response(req, res, next);
    response.view_path  = './users/login';
    response.title      = 'Login';
    response.layout     = 'layout/page';
    response.body_class = 'login-page';
    response.focus      = '[name="user_name"]';
    res.render(response.view_path, response);
};

/* controller create admin */
exports.createAdmin = function (req, res, next) {
    if (req.isAuthenticated()) { return res.redirect('/'); }
    usersTable.count({role: define.ROLE_1}, function (err, count) {
        if (count <= 0) {
            var usersEntity = new usersTable();
            usersEntity.user_name  = 'admin';
            usersEntity.first_name = 'My';
            usersEntity.last_name  = 'Admin';
            usersEntity.email      = 'admin@gmail.com';
            usersEntity.phone      = '0123456789';
            usersEntity.password   = crypt.sha1('123456');
            usersEntity.role       = define.ROLE_1;
            usersEntity.save(function (err, user){
                req.flash('success', 'Tạo tài khoản admin thành công!');
                return res.redirect('/users/login');
            });
        } else {
            req.flash('error', 'Đã tồn tại tài khoản Admin không thể tạo thêm');
            return res.redirect('/users/login');
        }
    });
};

/* controller logout */
exports.logout = function (req, res, next) {
    req.logout();
    return res.redirect('/users/login');
};

/* controller register */
exports.register = function (req, res, next) {	
    var response = controller.response(req, res, next);
    response.view_path  = './users/register';
    response.title      = 'Register';
    response.layout     = 'layout/page';
    response.body_class = 'register-page';
    res.render(response.view_path, response);
};

/* controller forgot */
exports.forgot = function (req, res, next) {
    if (req.isAuthenticated()) { res.redirect('/'); }
    var response = controller.response(req, res, next);
    response.view_path  = './users/forgot';
    response.title      = 'Forgot Password';
    response.layout     = 'layout/page';
    response.body_class = 'forgot-page';
    response.focus      = '[name="email"]';
    res.render(response.view_path, response);
};

/* controller manager user */
exports.index = function (req, res, next) {
    var response = controller.response(req, res, next);
    response.view_path  = './users/index';
    response.title      = 'List Users';

    usersModel.getUsersLists({}, false, 0, false, function(err, listUsers){
        response.listUsers = usersModel.processDataUser(listUsers);
        res.render(response.view_path, response);
    });
};

/* controller add User */
exports.add = function (req, res, next) {
    var response = controller.response(req, res, next);
    response.view_path = './users/add';
    response.title     = 'Add User';
    response.focus     = '[name="user_name"]';
    response.roles     = define.ROLES;

    if (req.originalMethod == 'POST') {
        var data = req.body;
        req.checkBody(usersModel.validateAdd(data));
        req.getValidationResult().then(function(result){
            var errors = result.array();
            if (result.isEmpty()) {
                var usersEntity = new usersTable();
                usersEntity.user_name  = data.user_name;
                usersEntity.first_name = data.first_name;
                usersEntity.last_name  = data.last_name;
                usersEntity.email      = data.email;
                usersEntity.phone      = data.phone;
                usersEntity.password   = crypt.sha1(data.password);
                usersEntity.role       = data.role;
                usersEntity.save(function (err, user){
                    if (user) {
                        req.flash('success', 'Thêm thành viên thành công!');
                        return res.redirect('/users/edit/' + user.id);
                    } else {
                        req.flash('error', 'Thêm thành viên không thành công!');
                    }
                    response.forms = data;
                    return res.render(response.view_path, response);
                });
            } else {
                req.flash('error', errors[0].msg);
                response.focus = '[name="' + errors[0].param + '"]';
                response.forms = data;
                return res.render(response.view_path, response);
            }
        });
    } else {
        response.forms = {};
        res.render(response.view_path, response);
    }
};

/* controller Edit User */
exports.edit = function (req, res, next) {
    var response = controller.response(req, res, next);
    response.view_path = './users/edit';
    response.title     = 'Edit User';
    response.focus     = '[name="user_name"]';
    response.roles     = define.ROLES;
    
    var id = req.params.id;
    if(id){
        usersModel.getUser(id, function(err, user){
            if (err || !user) {
                req.flash('error', 'Thành viên không tồn tại!');
                return res.redirect('/users/index');
            }
            if (req.originalMethod == 'POST') {
                var data = req.body;
                req.checkBody(usersModel.validateEdit(data, user));
                req.getValidationResult().then(function(result){
                    var errors = result.array();
                    if (result.isEmpty()) {
                        user.user_name  = data.user_name;
                        user.first_name = data.first_name;
                        user.last_name  = data.last_name;
                        user.email      = data.email;
                        user.phone      = data.phone;
                        user.role       = data.role;
                        user.save(function(err, user){
                            if (user) {
                                req.flash('success', 'Sửa thành viên thành công!');
                                return res.redirect('/users/edit/' + user.id);
                            } else {
                                req.flash('error', 'Sửa thành viên không thành công!');
                            }
                            response.forms = user;
                            return res.render(response.view_path, response);
                        });
                    } else {
                        req.flash('error', errors[0].msg);
                        response.focus = '[name="' + errors[0].param + '"]';
                        response.forms = data;
                        return res.render(response.view_path, response);
                    }
                });
            } else {
                response.forms = user;
                return res.render(response.view_path, response);
            }
        });
    } else {
        req.flash('error', 'ID không hợp lệ');
        return res.redirect('/users/index');
    }
};

/* controller Detail User */
exports.detail = function (req, res, next) {
    var response       = controller.response(req, res, next);
    response.view_path = './users/detail';
    response.title     = 'Detail User';

    var id = req.params.id;
    if(id){
        usersModel.getUser(id, function(err, user){
            response.user = usersModel.processDataUser(user, true);
            res.render(response.view_path, response);
        });
    } else {
        req.flash('error', 'ID không hợp lệ');
        return res.redirect('/users/index');
    }
};

/* controller Detail User */
exports.delete = function (req, res, next) {
    var response = controller.response(req, res, next);
    var id = req.params.id;
    if(id){
        usersModel.getUser(id, function(err, user){
            if (err || !user) {
                req.flash('error', 'Thành viên không tồn tại!');
                return res.redirect('/users/index');
            }
            user.remove(function(err, user){
                if (user) {
                    req.flash('success', 'Xóa thành viên thành công!');
                } else {
                    req.flash('error', 'Xóa thành viên không thành công!');
                }
                return res.redirect('/users/index');
            });
        });
    } else {
        req.flash('error', 'ID không hợp lệ');
        return res.redirect('/users/index');
    }
};


/* controller profile */
exports.profile = function (req, res, next) {
    var response       = controller.response(req, res, next);
    response.view_path = './users/profile';
    response.title     = 'Profile';
    response.focus     = '[name="user_name"]';
    var id = req.user.id;
    if(id){
        usersModel.getUser(id, function(err, user){
            if (err || !user) {
                req.flash('error', 'Thành viên không tồn tại!');
                return res.redirect('/users/index');
            }
            if (req.originalMethod == 'POST') {
                var data = req.body;
                req.checkBody(usersModel.validateEdit(data, user));
                req.getValidationResult().then(function(result){
                    var errors = result.array();
                    if (result.isEmpty()) {
                        user.user_name  = data.user_name;
                        user.first_name = data.first_name;
                        user.last_name  = data.last_name;
                        user.email      = data.email;
                        user.phone      = data.phone;
                        user.role       = data.role;
                        user.save(function(err, user){
                            if (user) {
                                req.flash('success', 'Update profile success!');
                                return res.redirect('/users/edit/' + user.id);
                            } else {
                                req.flash('error', 'Update profile failure!');
                            }
                            response.forms = user;
                            return res.render(response.view_path, response);
                        });
                    } else {
                        req.flash('error', errors[0].msg);
                        response.focus = '[name="' + errors[0].param + '"]';
                        response.forms = data;
                        return res.render(response.view_path, response);
                    }
                });
            } else {
                response.forms = user;
                return res.render(response.view_path, response);
            }
        });
    } else {
        req.flash('error', 'ID không hợp lệ');
        return res.redirect('/users/index');
    }
};