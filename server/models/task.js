import mongoose from 'mongoose';

// create task Schema

const taskSchema = new mongoose.Schema({
    content: String
});

export default mongoose.Schema(taskSchema);