// Import mongoose library to use MongoDB
const mongoose = require('mongoose');
// import library for encrypting data
const crypto = require('crypto');

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
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex');
}

// Validate the password the user enters and the one in the db
userSchema.methods.validPassword = function(password){
    let hash = crypto.pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

module.exports = mongoose.model('User', userSchema);
