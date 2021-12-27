"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.User = void 0;

var _express = require("express");

var _index = _interopRequireDefault(require("express-validator/check/index.js"));

var _passport = _interopRequireDefault(require("passport"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = _interopRequireDefault(require("../models/user.js"));

var _expressSession = _interopRequireDefault(require("express-session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var check = _index["default"].check,
    validationResult = _index["default"].validationResult;
var router = (0, _express.Router)();

var userModel = _mongoose["default"].model('User', _user["default"]);

exports.User = userModel;
router.route('/login').get(function (req, res, next) {
  res.render('login', {
    title: "Login"
  });
}).post(_passport["default"].authenticate('local', {
  successRedirect: '/createTask',
  failureRedirect: '/login'
}), function (req, res, next) {
  req.session.save(function (err) {
    if (err) {
      res.render('error', {
        errorMessages: err.array()
      });
    } else {
      return res.redirect('/', {
        user: req.user
      });
    }
  });
});
router.route('/register').get(function (req, res, next) {
  res.render('register', {
    title: 'Register a new account'
  });
}).post([check('name', "Name field is empty"), check('email', "Invalid Email").isEmail().trim(), check('password', "Invalid Password").custom(function (value, _ref) {
  var req = _ref.req;

  if (value !== req.body.confirmPassword) {
    throw new Error("Passwords don't match");
  } else {
    return true;
  }
})], function (req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('register', {
      errorMessages: errors.array()
    });
  } else {
    var user = new userModel();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function (err) {
      if (err) {
        return res.render('register', {
          errorMessages: errors.array()
        });
      }

      res.redirect('/login');
    });
  }
});
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});
var _default = router;
exports["default"] = _default;