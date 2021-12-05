"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = require("passport-local");

var _user = _interopRequireDefault(require("./models/user.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var User = _mongoose["default"].model('User', _user["default"]);

exports["default"] = User;

_passport["default"].serializeUser(function (user, done) {
  done(null, user._id);
});

_passport["default"].deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

_passport["default"].use(new _passportLocal.Strategy({
  usernameField: 'email',
  passswordField: 'password'
}, function (username, password, done) {
  User.findOne({
    email: username
  }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {
        message: 'Incorrect username or password!'
      });
    }

    if (!user.validPassword(password)) {
      return done(null, false, {
        message: 'Incorrect username or password'
      });
    }

    return done(null, user);
  });
}));