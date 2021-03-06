const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const async = require('async');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');



const app = express();

//
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(session({
  resave: true,
  saveUinitialiazed: true,
  secret: "manish",
  store: new MongoStore({ url: 'mongodb://root:geetasingh2612@ds133044.mlab.com:33044/newsletter'})
}));
app.use(flash());

app.route('/')
  .get((req, res, next) => {
    res.render('main/home', { message: req.flash('success') });
  })
  .post((req, res, next) => {
    request({
      url: 'https://us17.api.mailchimp.com/3.0/lists/09acc06626/members',
      method: 'POST',
      headers: {
        'Authorization': 'randomUser 49cf6425a0e717cf777cf7a101b8a93f-us17',
        'Content-Type': 'application/json'
      },
      json: {
        'email_address': req.body.email,
        'status': 'subscribed'
      }
    }, function(err, response, body) {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'You have submitted your email');
        res.redirect('/');
      }
    });
  });

// Session = memory store, if you want to perserve the data for future use
// Data Store = mongodb, redis

app.listen(303, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Running on Port 303");
  }
});
