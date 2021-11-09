const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');


// Route for creating a task
router.get('/createTask', (req, res) => {
    const newTask = new Task();
    newTask.save((err, data) => {
        if(err){
            console.log(err);
            res.render('error');
        }else{
            res.redirect('/task/' + data._id);
        }
    });
});

// Route for creating a t
router.get('/task/:id', (req, res, next) => {
    if(req.params.id){
        Task.findOne({_id: req.params.id}, (err, data) => {
            if(err){
                console.log(err);
                res.render('error');
            }
            if(data){
                res.render('task', {data: data});
            }else{
                res.render('error');
            }
        })
    }else{
        res.render('error');
    }
});

module.exports = router;