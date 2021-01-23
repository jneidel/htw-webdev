const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const configureDatabase = require("./database");
const models = require("../models");


const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const db = await configureDatabase(process.env);
        const User = models.User(db);
        let failMessage = "Authentication failed"
        const user = await User.findOne(
            {
                where: { email: email },
                raw: true
            }
        );
        console.log(user)
        if (user == null) {
            return done(null, false, { message: failMessage })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log("user found")
                return done(null, user)
            } else {
                return done(null, false, { message: failMessage })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        console.log("deserilaizing")
        const db = await configureDatabase(process.env);
        const User = models.User(db);
        const user = await User.findOne(
            {
                where: { id: id },
                raw: true
            }
        );
        return done(null, user)
    })
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
    console.log("checking not-authentication")
    if (req.isAuthenticated()) {
        return res.redirect("/home")
    }
    next()
}

module.exports = {
    initialize,
    checkAuthenticated,
    checkNotAuthenticated,
    sess
}