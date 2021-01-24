const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const passport_config = require("../util/passportUtil");
const checkNotAuthenticated = passport_config.checkNotAuthenticated;

router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
}));

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    req.models.User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect("/login")
  } catch {
    res.redirect("/register")
  }
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