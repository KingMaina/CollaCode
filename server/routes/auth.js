import { Router } from 'express';
import ExpressValidator from 'express-validator/check/index.js';
import passport from 'passport';
import mongoose from 'mongoose';
const { check, validationResult } = ExpressValidator;
import userSchema from '../models/user.js';
import session from 'express-session';

const router = Router();
const userModel = mongoose.model('User', userSchema);

router.route('/login')
    .get((req, res, next) => {
        res.render('login', { title: "Login" });
    })
    .post(passport.authenticate('local', {
            successRedirect: '/createTask',
            failureRedirect: '/login'
        } 
    ),  (req, res, next) => {
         req.session.save((err) => {
             if (err){
                res.render('error', {errorMessages:err.array()})
             }else{
            return res.redirect('/', {user: req.user});
             }
        });
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
                const user = new userModel();
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

export {userModel as User};
export default router;