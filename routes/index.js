const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const ensureLogin = require("connect-ensure-login");
const roles = require('../middlewares/roles');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
}); 