import { Router } from 'express';
import  mongoose  from 'mongoose';
import { async } from "regenerator-runtime";
import { taskSchema } from '../models/task.js';
import { Task } from './task.js';
import { MongoClient } from 'mongodb';
import { dbConnstring } from '../config.js';

const router = Router();
const url = dbConnstring;
const client = new MongoClient(url);

const countTasks = async (database) =>{
    const tasks = database.collection('tasks');
    // Count number of tasks in the database to display
    const tasksCount = await tasks.countDocuments();
    return tasksCount;
}
const connectToDb = async() => {
  await client.connect();
  const database = client.db('collacode');
  return database;
}

const countUsers = async(database) => {
  const users = database.collection('users');
  // Count number of users
  const usersCount = await users.countDocuments();
  return usersCount;
}

router.route('/admin')
  .get(async (req, res, next) => {
    let tasksCount;
    let usersCount;
    await connectToDb()
    .then(async (database, error) => {
      if(error){
        console.error(`Error establishing connection to database\n${error}`);
      }else{
        await countTasks(database).then(count => {
          tasksCount = count;
        }).catch(console.dir);
        await countUsers(database).then(users => {
          usersCount = users;
        }).catch(console.dir);
      }
    })
    .catch(console.dir)
    .finally(async() => await client.close());

    res.render('admin', {
      title: "Admin page",
      isAdmin: true,
      tasks: tasksCount,
      users: usersCount
    });
  });

export default router;