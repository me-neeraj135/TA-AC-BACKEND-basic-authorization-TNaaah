/** @format */

var express = require("express");
var User = require(`../models/User`);
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// get users register
router.get(`/register`, (req, res, next) => {
  let info = req.flash(`info`)[0];
  res.render(`register-form`, { info });
});

router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    // console.log(err, user);
    res.redirect(`/users/login`);
  });
});

// get user login

router.get(`/login`, (req, res, next) => {
  let info = req.flash(`info`)[0];
  res.render(`login-form`, { info });
});

router.post(`/login`, (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    req.flash(`info`, `email/password is required`);
    return res.redirect(`/users/login`);
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    // user as null
    if (!user) {
      req.flash(`info`, `user not found`);
      return res.redirect(`/users/login`);
    }

    // compare password

    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);

      // result as false
      if (!result) {
        req.flash(`info`, `password is incorrect`);
        return res.redirect(`/users/login`);
      }
      // persist session into database
      req.session.userId = user.id;
      res.redirect(`/`);
    });
  });
});

// user logout

router.get(`/logout`, (req, res, next) => {
  req.session.destroy();
  res.clearCookie(`connect.sid`);
  res.redirect(`/`);
});
module.exports = router;
