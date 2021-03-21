const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const passport_config = require("../util/passportUtil");
const { checkNotAuthenticated, checkAuthenticated, returnAuthentication } = passport_config;

router.use(returnAuthentication);

router.post("/login", passport.authenticate("local", {
  successRedirect: "/app",
  failureRedirect: "/login",
  failureFlash: true,
}));

router.post("/user/password", checkAuthenticated, async (req, res, next) => {
  const password = req.body.password
  if (!password || password === "") {
    return next(new Error("400: empty user password"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const updateObj = { password: hashedPassword }

  req.models.User.update(updateObj, 
    {
      where: { id: res.locals.userid } 
    })
    .then(() => res.json({ error: false }))
    .catch(err => next(err));
  req.flash("error", "Please sign in again")
  req.logOut();
  res.redirect("../../login")
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const user = await req.models.User.findOne(
      {
        where: { username: req.body.username },
        raw: true,
      }
    );
    if (user == null) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.models.User.create({
        username: req.body.username,
        password: hashedPassword,
      });
      res.redirect("/login");
    } else {
      req.flash("error", "Username already taken!");
      res.redirect("/register");
    }
  } catch {
    res.redirect("/register");
  }
});

router.post("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

// todo crud
router.route("/todos")
  .get((req, res, next) => {
    req.models.Todo.findAll({
      attributes: ["id", "text", "createdAt", "done"],
      order: [["createdAt", "DESC"]],
    })
      .then(todos => res.json({ error: false, todos }))
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    // delete all done todos
    req.models.Todo.destroy({ where: { done: true } })
      .then(() => res.json({ error: false }))
      .catch(err => next(err));
  });

router.route("/todo")
  .post((req, res, next) => {
    const { text } = req.body;
    if (!text)
      return next(new Error("400: empty todo text"));

    req.models.Todo.create({ text })
      .then(todo => res.json({ error: false, id: todo.id }))
      .catch(err => next(err));
  })
  .put((req, res, next) => {
    const { id, text, done } = req.body;
    if (!id)
      return next(new Error("400: missing todo id"));
    if (text === "")
      return next(new Error("400: empty todo text"));
    if (text === undefined && done === undefined)
      return next(new Error("400: nothing to update"));

    const updateObj = {};
    if (text !== undefined)
      updateObj.text = text;
    if (done !== undefined)
      updateObj.done = done;

    req.models.Todo.update(updateObj, { where: { id } })
      .then(() => res.json({ error: false }))
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    const { id } = req.body;
    if (!id)
      return next(new Error("400: missing todo id"));

    req.models.Todo.destroy({ where: { id } })
      .then(() => res.json({ error: false }))
      .catch(err => next(err));
  });

module.exports = router;
