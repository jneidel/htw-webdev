const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

const users = []
const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        let failMessage = "Authentication failed"
        const user = getUserByEmail(email)
        if (user == null){
            return done(null, false, {message: failMessage})
        }

        try{
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: failMessage})
            }
        } catch(e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: "email"}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
      return next()
    }
    res.redirect("/login")
}
  
function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect("/home")
    }
    next()
}

module.exports =  {
    initialize,
    checkAuthenticated,
    checkNotAuthenticated,
    users,
    sess
}