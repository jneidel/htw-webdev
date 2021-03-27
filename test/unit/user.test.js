require('iconv-lite').encodingExists('foo');

const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

// apiErrorHandler middleware logs errors
global.console = {
    error: jest.fn(),
};

process.on("unhandledRejection", (err) => { throw err; });

const DBresolvedReq = (data = {}) => jest.fn(() => Promise.resolve(data));
const DBrejectedReq = err => jest.fn(() => Promise.reject(err));

let app, UserMock;

beforeEach(() => {
    // setup app, different instances for paralell execution w/ seperate mocks
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const standarUser =
    {
        id: "f8c79056-0b85-43ad-b740-6642d9ee5b3c",
        username: "Leon",
        password: "$2b$10$kCzJI1ZWHN0uAZ0YFBNEFemddORcYvwwREBo.biSvGTuhcsW127JK",
    };

    UserMock = {
        findAll: DBresolvedReq(),
        update: DBresolvedReq(),
        destroy: DBresolvedReq(),
        create: DBresolvedReq(),
        findOne: DBresolvedReq(),
    };

    app.use((req, res, next) => {
        req.models = { User: UserMock };
        next();
    });

    app.use(flash());
    app.use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    }));

    UserMock.findOne.mockReturnValue(new Promise((resolve, reject) => resolve(standarUser)));

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy({
        usernameField: "username",
        passReqToCallback: true,
    }, (req, username, password, done) => { return done(null, standarUser); }));

    passport.serializeUser((user, done) => { done(null, standarUser.id) });
    passport.deserializeUser(async (req, id, done) => {
        return done(null, standarUser);
    });

    app.use((req, res, next) => {
        res.locals.username = standarUser.username;
        res.locals.userid = standarUser.id;
        next();
    })

    app.use("/", require("../../routes"));
    app.use("/api", require("../../routes/api"));
    app.use("/api", require("../../routes/apiErrorHandler"));
});



describe("DELETE /api/user", () => {
    test("success", async () => {
        const data = { username: "Leon", password: "w" }

        let agent = request.agent(app);

        agent
            .post("/api/login")
            .send(data)
            .end((err, res) => {
                expect(res.text).toBe("Found. Redirecting to /app");
                agent
                    .delete("/api/user")
                    .send(data)
                    .end((err, res) => {
                        expect(res.text).toBe("Found. Redirecting to ../../login");
                    });
            });
    });

    test("wrong username - don't delete user", async () => {
        const data = { username: "Leon", password: "w" }
        const wrongName = { username: "Noel" }

        let agent = request.agent(app);

        agent
            .post("/api/login")
            .send(data)
            .end((err, res) => {
                expect(res.text).toBe("Found. Redirecting to /app");
                agent
                    .delete("/api/user")
                    .send(wrongName)
                    .end((err, res) => {
                        expect(res.text).toBe("Found. Redirecting to /manager");
                    });
            });
    });

    test("empty username - don't delete user", async () => {
        const data = { username: "Leon", password: "w" }
        const emptyName = { username: "" }

        let agent = request.agent(app);

        agent
            .post("/api/login")
            .send(data)
            .end((err, res) => {
                expect(res.text).toBe("Found. Redirecting to /app");
                agent
                    .delete("/api/user")
                    .send(emptyName)
                    .end((err, res) => {
                        expect(res.status).toBe(400);
                        expect(res.body.error).toBeTruthy();
                        expect(res.body.errorMsg).toBe("empty username");
                    });
            });
    });

    test("undefined username - don't delete user", async () => {
        const data = { username: "Leon", password: "w" }
        const emptyName = {}

        let agent = request.agent(app);

        agent
            .post("/api/login")
            .send(data)
            .end((err, res) => {
                expect(res.text).toBe("Found. Redirecting to /app");
                agent
                    .delete("/api/user")
                    .send(emptyName)
                    .end((err, res) => {
                        expect(res.status).toBe(400);
                        expect(res.body.error).toBeTruthy();
                        expect(res.body.errorMsg).toBe("empty username");
                    });
            });
    });
});

// throw unreasonable TypeErrors

/* describe("Put /api/user/username", () => {
    test("success", async () => {
        const data = { username: "Leon", password: "w" }
        const newName = { username: "Ulrich" }

        let agent = request.agent(app);

        agent
            .post("/api/login")
            .send(data)
            .end((err, res) => {
                expect(res.text).toBe("Found. Redirecting to /app");
                agent
                    .put("/api/user/username")
                    .send(newName)
                    .end((err, res) => {
                        //expect(res.text).toBe("Found. Redirecting to ../../login");
                    });
            });
    });
}); */

/* describe("PUT /api/user/password", () => {
    test("undefined username - don't delete user", async () => {
        const data = { username: "Leon", password: "w" }
        const newPassword = {password: "p"}

        let agent = request.agent(app);

        agent
            .post("/api/login")
            .send(data)
            .end((err, res) => {
                expect(res.text).toBe("Found. Redirecting to /app");
                agent
                    .put("/api/user/password")
                    .send(newPassword)
                    .end((err, res) => {
                        //expect(res.text).toBe("Found. Redirecting to ../../login");
                    });
            });
    });
}); */