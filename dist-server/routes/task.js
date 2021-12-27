"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Task = void 0;

var _express = require("express");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _task = _interopRequireDefault(require("../models/task.js"));

var _auth = require("./auth.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();

var taskModel = _mongoose["default"].model('Task', _task["default"]); // Route for creating a task


exports.Task = taskModel;
router.get('/createTask', function (req, res) {
  // if (!User) {
  //     res.render('login', { title: "Login to Continue" });
  // }
  // if (!req.params.id) {
  //     res.redirect('/login');
  // } else {
  var newTask = new taskModel();
  newTask.save(function (err, data) {
    if (err) {
      console.log(err);
      res.render('error');
    } else {
      res.redirect('/task/' + data._id);
    }
  }); // }
}); // Route for creating a task room

router.get('/task/:id', function (req, res, next) {
  if (req.params.id) {
    taskModel.findOne({
      _id: req.params.id
    }, function (err, data) {
      if (err) {
        console.log(err);
        res.render('error');
      }

      if (data) {
        res.render('task', {
          content: data.content,
          roomId: data.id
        });
      } else {
        res.render('error');
      }
    });
  } else {
    res.render('error');
  }
});
var _default = router;
exports["default"] = _default;