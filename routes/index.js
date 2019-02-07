const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const User = require("../models/user");
const ensureLogin = require("connect-ensure-login");
const roles = require('../middlewares/roles');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/courses", (req, res, next) => {
  res.send("OK, you got it");
});

router.get("/participants", (req, res, next) => {
  res.send("OK, you got it");
});

module.exports = router;