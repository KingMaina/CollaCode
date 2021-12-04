"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _crypto = require("crypto");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Import mongoose library to use MongoDB
// import library for encrypting data
// Define database object types to be stored in the database
var userSchema = new _mongoose["default"].Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});
/* Encrypt the password using crypto library  and convert to a string*/

userSchema.methods.setPassword = function (password) {
  this.salt = (0, _crypto.randomBytes)(16).toString('hex');
  this.hash = (0, _crypto.pbkdf2Sync)(password, 'salt', 1000, 64, 'sha512').toString('hex');
}; // Validate the password the user enters and the one in the db


userSchema.methods.validPassword = function (password) {
  var hash = (0, _crypto.pbkdf2Sync)(password, 'salt', 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

var _default = _mongoose["default"].Schema(userSchema);

exports["default"] = _default;