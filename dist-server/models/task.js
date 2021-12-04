"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// create task Schema
var taskSchema = new _mongoose["default"].Schema({
  content: String
});

var _default = _mongoose["default"].Schema(taskSchema);

exports["default"] = _default;