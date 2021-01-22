const express = require("express");
const router = express.Router();

const passport_config = require("../util/passportUtil")
const checkAuthenticated = passport_config.checkAuthenticated;
const checkNotAuthenticated = passport_config.checkNotAuthenticated

router.get("/", (req, res) => res.render("landing", { title: "What to do?" }));
router.get("/welcome", (req, res) => res.render("welcome", { title: "wd-todo" }));
router.get("/login", checkNotAuthenticated, (req, res) => res.render("login", { title: "login" }));
router.get("/register", checkNotAuthenticated, (req, res) => res.render("register", { title: "register" }));
router.get("/home", checkAuthenticated, (req, res) => res.render("home", { title: "home", name: "Guest" }));

module.exports = router;
