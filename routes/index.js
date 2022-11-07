var express = require('express');
var router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');
const md5 = require('md5');
const {getUserByUsernameAndEmail} = require("./utilities/utility.db");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Soccer City Cards'});
});

router.get('/error',function (req,res,next){
  res.render('error',{
    message: req.session.messages[0]
  });
});

router.post('/login/password', passport.authenticate('local', {
  successReturnToOrRedirect: '/users',
  failureRedirect: '/error',
  failureMessage: true
}));

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  const salt = md5(req.body.username);
  const buff = Buffer.from(salt + req.body.password , 'utf-8');
  const hashedPassword = buff.toString('base64');
  db.query("INSERT INTO users (username, email ,hashed_password, salt) VALUES ( '"+ req.body.username +"','"+ req.body.email +"','"+ hashedPassword +"' , '"+ salt +"')", function(err,result,fields) {
    if (err) { return next(err); }
    let user = {
      id: result.insertId,
      username: req.body.username
    };
    req.login(user, function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
});

router.get('/recover_password',function (req,res,next){
  res.render('recover_password');
});

router.post('/recover_password',function (req,res,next){
  if(req.body.username && req.body.email){
    getUserByUsernameAndEmail(req.body.username,req.body.email,function (err,data){
      if(!err){
        let mailTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'rostagno.francesco@gmail.com',
            pass: 'duarwhxmlvubibgf'
          }
        });
        let token = md5(req.body.username);
        let mailDetails = {
          from: 'rostagno.francesco@gmail.com',
          to: req.body.email,
          subject: 'CardCollection Reset Password',
          text: 'http://localhost:3000/change_password/' + req.body.username + '/' + token
        };
        mailTransporter.sendMail(mailDetails, function(err, data) {
          if(err) {
            res.send('Error: ' + err)
          } else {
            res.send('Email sent successfully');
          }
        });
      }else {
        res.send('No User!')
      }
    })
  }else{
    res.send('Insert Username And Email!')
  }
});
router.get('/change_password/:username/:token',function (req,res,next){
  res.render('change_password',);
})

router.post('/change_password/',function (req,res,next){

  if(req.body.username && req.body.password){
    const salt = md5(req.body.username);
    const buff = Buffer.from(salt + req.body.password , 'utf-8');
    const hashedPassword = buff.toString('base64');

    db.query("UPDATE users SET hashed_password = '" + hashedPassword + "', salt = '" + salt + "' WHERE username = '" + req.body.username + "' AND email = '" + req.body.email + "' ",function (err,response){
      if(!err){
        res.send('Change successfully')
      }else{
        res.send('Err: ' + err);
      }
    })
  }
})


module.exports = router;
