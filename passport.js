import passport from 'passport';
import passport_local from 'passport-local';
const { serializeUser, deserializeUser, use } = passport;
const { Strategy: LocalStrategy } = passport_local;

// create 
// serializeUser((user, done) => {
//     done(null, user._id);
// });

// deserializeUser((id, done)=> {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });


// use(new LocalStrategy(
//     {
//         usernameField: 'email'
//     }, 
//     (username, password, done) => {
//         User.findOne({email: username}, (err, user) => {
//             if(err) {return done(err);}
//             if(!user){
//                 return done(null, false, {
//                     message: 'Incorrect username or password'
//                 });
//             }
//             if(!user.validPassword(password)){
//                 return done(null, false, {
//                     message: 'Incorrect username or password'
//                 });
//             }
//             return done(null, user);
//         });
//     }
// ));