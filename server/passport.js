import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import userSchema from './models/user.js';
import mongoose from 'mongoose';

let User = mongoose.model('User', userSchema);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passswordField: 'password'
    }, 
    (username, password, done) => {
        User.findOne({email: username}, (err, user) => {
            if(err) {return done(err);}
            if(!user){
                return done(null, false, {
                    message: 'Incorrect username or password!'
                });
            }
            if(!user.validPassword(password)){
                return done(null, false, {
                    message: 'Incorrect username or password'
                });
            }
            return done(null, user);
        });
    }
));

export { User as default}; 