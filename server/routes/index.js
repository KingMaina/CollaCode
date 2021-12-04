import { Router } from 'express';
const router = Router();

import { createTransport } from 'nodemailer';
import { mailer } from '../config.js';
let transporter = createTransport(mailer);

/* Get HOME page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CollaCode - collaborate and share code with others!' });
  // res.render('register', {title: 'register '})
});

/* Get ABOUT page */
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'CollaCode - collaborate and share code with others!' });
});

/* Get CONTACT page */
router.route('/contact')
  .get(function (req, res, next) {
    res.render('contact', { title: 'Get in touch with us' });
  })
  .post(function (req, res, next) {
    req.check('name', 'Invalid name').notEmpty();
    req.check('email', "Invalid Email").isEmail();
    req.check('message', "Empty Message").notEmpty();
    let errors = validationErrors(req);

    if (errors) {
      res.render('contact', {
        title: 'CollaCode - collaborate and share code with others!',
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors,
      });
    }
    else {

      /* CREATE MAIL STRUCTURE */
      let mailOptions = {
        from: 'CollaCode <no-reply@collacode.com>',
        to: 'drew29799@gmail.com',
        subject: 'You got a new message from a visitor!',
        text: req.body.message
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res.render('thanks', { title: 'Thank you!' });
      });

      // async function main() {
      //   let testAccount = await nodemailer.createTestAccount();

      //   let transporter = await nodemailer.createTransport({
      //     host: "smtp.ethereal.email",
      //     port: 587,
      //     secure: false,
      //     auth: {
      //       user: testAccount.user,
      //       pass: testAccount.pass,
      //     },
      //   });
        
      //   let info = await transporter.sendMail({
      //     from: "Andrew '<drew@collacode.com>'",
      //     to: "drew29799@gmail.com",
      //     subject: "Test",
      //     text: "This is a test",
      //     html: "<b>Hey there!!</b>",
      //   });

      //   console.log("Message sent %s", info.messageId);
      //   console.log("Message sent %s", nodemailer.getTestMessageUrl(info));
      //           res.render('thanks', { title: 'Thank you!' });

      // }
      // main().catch(console.error);
    }
  });
  export default router;