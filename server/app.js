import createError from 'http-errors';
import express, { json, urlencoded} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressValidator from 'express-validator';
import mongoose from 'mongoose';
import passport from 'passport'
import sessions from 'express-session';
import './passport.js';
import { dbConnstring, sessionKey} from './config.js';

import indexRoute from './routes/index.js';
import authRoute from './routes/auth.js';
import taskRoute from './routes/task.js';

// Connect to the MongoDB database
mongoose.connect(dbConnstring, err => {
  if (err) console.error(err);
});
global.User = './routes/auth.js';
global.Task = './models/task.js';

const app = express();
const __dirname = path.resolve();
// view engine setup
app.set('views',`${__dirname}/views`);
app.set('view engine', 'hbs');
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: `${sessionKey}`,
  saveUninitialized: true,
  cookie: {maxAge: oneDay},
  resave: false
}));
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(`${__dirname}/public`));

// app.use('/codemirror', express.static(path.join(__dirname, 'node_modules', 'codemirror')));
// app.use('/yjs', express.static(path.join(__dirname, 'node_modules', 'yjs')));
// app.use('/y-websocket', express.static(path.join(__dirname, 'node_modules', 'y-websocket')));
// app.use('/y-codemirror', express.static(path.join(__dirname, 'node_modules', 'y-codemirror')));
// app.use('/peerjs', express.static(path.join(__dirname, 'node_modules', 'peerjs')));


app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', taskRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
