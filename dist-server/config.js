'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionKey = exports.mailer = exports.dbConnstring = void 0;
var mailer = {
  service: 'Gmail',
  auth: {
    user: '#',
    pass: '#'
  }
};
exports.mailer = mailer;
var dbConnstring = 'mongodb://127.0.0.1:27017/collacode';
exports.dbConnstring = dbConnstring;
var sessionKey = 'CollaCodeSession';
exports.sessionKey = sessionKey;