"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _express = _interopRequireWildcard(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _expressValidator = _interopRequireDefault(require("express-validator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _passport = _interopRequireDefault(require("passport"));

var _config = require("./config.js");

var _index = _interopRequireDefault(require("./routes/index.js"));

var _auth = _interopRequireDefault(require("./routes/auth.js"));

var _task = _interopRequireDefault(require("./routes/task.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var initialize = _passport["default"].initialize,
    session = _passport["default"].session; // import session from 'express-session';
// import './passport.js';

// Connect to the MongoDB database
_mongoose["default"].connect(_config.dbConnstring);

global.User = './models/user.js'["default"];
global.Task = './models/task.js'["default"];
var app = (0, _express["default"])();

var _dirname = _path["default"].resolve(); // view engine setup


app.set('views', "".concat(_dirname, "/views"));
app.set('view engine', 'hbs');
app.use((0, _morgan["default"])('dev'));
app.use((0, _express.json)());
app.use((0, _express.urlencoded)({
  extended: false
}));
app.use((0, _expressValidator["default"])());
app.use((0, _cookieParser["default"])()); // app.use(initialize());
// app.use(session());

app.use(_express["default"]["static"]("".concat(_dirname, "/public")));
app.use('/codemirror', _express["default"]["static"](_path["default"].join(_dirname, 'node_modules', 'codemirror'))); // app.use('/yjs', express.static(path.join(__dirname, 'node_modules', 'yjs')));
// app.use('/y-websocket', express.static(path.join(__dirname, 'node_modules', 'y-websocket')));
// app.use('/y-codemirror', express.static(path.join(__dirname, 'node_modules', 'y-codemirror')));
// app.use('/taskView', express.static(path.join(__dirname, 'dist-server')));

app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  next();
});
app.use('/', _index["default"]);
app.use('/', _auth["default"]);
app.use('/', _task["default"]); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
var _default = app;
exports["default"] = _default;