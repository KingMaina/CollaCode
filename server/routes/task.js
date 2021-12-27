import { Router } from 'express';
const router = Router();
import mongoose from 'mongoose';
import taskSchema from '../models/task.js';
import { User } from './auth.js';

const taskModel = mongoose.model('Task', taskSchema);
// Route for creating a task
router.get('/createTask',  (req, res) => {
    // if (!User) {
    //     res.render('login', { title: "Login to Continue" });
    // }
    // if (!req.params.id) {
    //     res.redirect('/login');
    // } else {
        const newTask = new taskModel();
         newTask.save((err, data) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/task/' + data._id);
            }
        });
    // }
});

// Route for creating a task room
router.get('/task/:id', (req, res, next) => {
    if (req.params.id) {
        taskModel.findOne({ _id: req.params.id }, (err, data) => {
            if (err) {
                console.log(err);
                res.render('error');
            }
            if (data) {
                res.render('task', { content: data.content, roomId: data.id });
            } else {
                res.render('error');
            }
        });
    } else {
        res.render('error');
    }
});

export { taskModel as Task };
export default router;