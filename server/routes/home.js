import session from 'express-session';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import { Router } from 'express';
import userSchema from '../models/user.js';
import { User } from '../routes/auth.js';
import { Task } from './task.js';
import { async } from 'regenerator-runtime';

const router = Router();

let userName;
router.route('/home/:id')
    .get(async (req, res, next) => {
        try {
            let userData = req.cookies['userID'];
            userName = req.cookies['user'];

            if (userData) {
                await Task.find({ user: userData }, { sort: { length: -1}, limit: 10 },
                    (error, data) => {
                        if (error) {
                            return next(error);
                        } else {
                            res.render('home', { title: "Workspace", user: userName , taskList: data});
                        }
                    }).projection({id: 1, title: 1, description: 1, language: 1});
            }else{
                res.render('error');  
            }
        }
        catch (error) {
            return next(error);
        }
    })
    .post( (req, res, next) => {
        try {
            let userData = req.cookies['userID'];
            userName = req.cookies['user'];

            if (userData) {
                let taskDetails = {
                    user: userData,
                    title: req.body.title || 'example.js',
                    description: req.body.description,
                    language: req.body.language || 'text'
                }
                res.cookie("taskData", taskDetails, { maxAge: 900000, httpOnly: true });
                res.cookie("user", userName, { maxAge: 900000, httpOnly: true });
                res.redirect('/createTask');
            }
            else{
                res.render('error', {title: 'Error!'});
            }
        } catch (error) {
            return next(error);
        }
    });


export default router;