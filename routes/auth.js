const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");


router.get("/profile/add", (req, res, next) => {
  res.render("profile-add", {
    'errorMessage': req.flash('error')
  });
});

router.post("/profile/add", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const role = req.body.role;


  if (username == '' || password == '') {
    res.render('profile-add', {
      msgError: `username and password can't be empty`
    })
    return;
  }

  User.findOne({
      "username": username
    })
    .then(user => {
      if (user !== null) {
        res.render("profile-add", {
          msgError: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username: username,
        password: hashPass,
        name: name,
        role: role
      });

      newUser.save()
        .then(user => {
          res.redirect("/profile/add");
        })
        .catch(err => {
          throw new Error(err)
        });
    })
    .catch(err => {
      throw new Error(err)
    });

});


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    'errorMessage': req.flash('error')
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/courses",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/courses',
    failureRedirect: '/login'
  }));

module.exports = router;