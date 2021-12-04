// Import mongoose library to use MongoDB
import mongoose from 'mongoose';
// import library for encrypting data
import { randomBytes, pbkdf2Sync } from 'crypto';

// Define database object types to be stored in the database
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
});

/* Encrypt the password using crypto library  and convert to a string*/
userSchema.methods.setPassword = function(password) {
    this.salt = randomBytes(16).toString('hex');
    this.hash = pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex');
}

// Validate the password the user enters and the one in the db
userSchema.methods.validPassword = function(password){
    let hash = pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

export default mongoose.Schema(userSchema);
