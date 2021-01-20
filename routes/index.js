if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express");
const router = express.Router();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const passport_config = require("../util/passportUtil");

const initializePassport = passport_config.initialize;
const checkAuthenticated = passport_config.checkAuthenticated;
const checkNotAuthenticated = passport_config.checkNotAuthenticated
const sess = passport_config.sess;

//only neede while not connected to db
const users = passport_config.users

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

router.use(flash())
router.use(session(sess))

router.use(passport.initialize());
router.use(passport.session());

router.get("/", (req, res) => res.render("landing", { title: "What to do?" }));
router.get("/welcome", (req, res) => res.render("welcome", { title: "wd-todo" }));
router.get("/login", checkNotAuthenticated, (req, res) => res.render("login", { title: "login" }));
router.get("/register", checkNotAuthenticated, (req, res) => res.render("register", { title: "register" }));
router.get("/home", checkAuthenticated, (req, res) => res.render("home", { title: "home", name: "Guest" }));

module.exports = router;
