"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = _interopRequireDefault(require("express-validator/check/index.js"));

var _passport = _interopRequireDefault(require("passport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var authenticate = _passport["default"].authenticate;
var check = _index["default"].check,
    validationResult = _index["default"].validationResult; // import { session } from 'express-session';

var router = (0, _express.Router)(); // router.route('/login')
//     .get((req, res, next) => {
//         res.render('login', { title: "Login" });
//     })
//     .post(authenticate('local', {
//         failureRedirect: '/login'
//     }),  (req, res, next) => {
//         //  req.session.save(() => {
//             return res.redirect('/');
//         // })
//         //  req.logIn((user, err) => {
//         //     if (err) { return next(err)};
//         //     return res.redirect('/');
//         // }
//     });
// router.route('/register')
//     .get((req, res, next) => {
//         res.render('register', { title: 'Register a new account' });
//     })
//     .post([
//         check('name', "Name field is empty"),
//         check('email', "Invalid Email").isEmail().trim(),
//         check('password', "Invalid Password").custom((value, { req }) => {
//             if (value !== req.body.confirmPassword) {
//                 throw new Error("Passwords don't match");
//             } else {
//                 return true;
//             }
//         })
//     ],
//         (req, res) => {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.render('register', {
//                     errorMessages: errors.array()
//                 });
//             } else {
//                 let user = new User();
//                 user.name = req.body.name;
//                 user.email = req.body.email;
//                 user.setPassword(req.body.password);
//                 user.save(err => {
//                     if (err) {
//                         return res.render('register', {
//                             errorMessages: errors.array()
//                         });
//                     }
//                     res.redirect('/login');
//                 });
//             }
//         }
//     );

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});
var _default = router;
exports["default"] = _default;