const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

function initialize(passport) {
    async function authenticateUser(req, email, password, done) {
        const failMessage = "Authentication failed"
        const user = await req.models.User.findOne(
            {
                where: { email: email },
                raw: true
            }
        );
        if (user == null) {
            return done(null, false, { message: failMessage })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: failMessage })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({
        usernameField: "email",
        passReqToCallback: true
    }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (req, id, done) => {
        const user = await req.models.User.findOne(
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
    if (req.isAuthenticated()) {
        return res.redirect("/home")
    }
    next()
}

function returnAuthentication(req, res, next){
    if (req.isAuthenticated()){
        res.locals.isAuthorized = true;
    } else {
        res.locals.isAuthorized = false;
    }
    next()
}

module.exports = {
    initialize,
    checkAuthenticated,
    checkNotAuthenticated,
    returnAuthentication
}