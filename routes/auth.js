const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const passport = require('passport');
const {session} = require('express-session');


router.route('/login')
    .get((req, res, next) => {
        res.render('login', { title: "Login" });
    })
    .post(passport.authenticate('local', {
        failureRedirect: '/login'
    }),  (req, res, next) => {
        //  req.session.save(() => {
            return res.redirect('/');
        // })
        //  req.logIn((user, err) => {
        //     if (err) { return next(err)};
        //     return res.redirect('/');
        // }
        
    });

router.route('/register')
    .get((req, res, next) => {
        res.render('register', { title: 'Register a new account' });
    })
    .post([
        check('name', "Name field is empty"),
        check('email', "Invalid Email").isEmail().trim(),
        check('password', "Invalid Password").custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                throw new Error("Passwords don't match");
            } else {
                return true;
            }
        })
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('register', {
                    errorMessages: errors.array()
                });
            } else {
                let user = new User();
                user.name = req.body.name;
                user.email = req.body.email;
                user.setPassword(req.body.password);
                user.save(err => {
                    if (err) {
                        return res.render('register', {
                            errorMessages: errors.array()
                        });
                    }
                    res.redirect('/login');
                });
            }
        }
    );

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;