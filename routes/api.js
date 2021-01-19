if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const passport_config = require("../util/passport-config");

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

router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
}));

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      //should be handled by db once it is connected
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect("/login")
  } catch {
    res.redirect("/register")
  }
  console.log(users)
});

router.delete("/logout", (req, res) => {
  req.logOut()
  req.redirect("/login")
})

// /api routes
router.get("/", (req, res) => {
  res.sendStatus(200);
});
router.get("/:anything", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;