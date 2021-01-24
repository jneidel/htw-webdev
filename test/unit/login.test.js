const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const passport_config = require("../../util/passportUtil");

// apiErrorHandler middleware logs errors
global.console = {
  error: jest.fn(),
};

const DBresolvedReq = (data = {}) => jest.fn(() => Promise.resolve(data));
const DBrejectedReq = err => jest.fn(() => Promise.reject(err));

let app, UserMock;

beforeEach(() => {
  // setup app, different instances for paralell execution w/ seperate mocks
  app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  UserMock = {
    findAll: DBresolvedReq(),
    update: DBresolvedReq(),
    destroy: DBresolvedReq(),
    create: DBresolvedReq(),
    findOne: DBresolvedReq()
  }

  app.use((req, res, next) => {
    req.models = { User: UserMock };
    next();
  });

  app.use(flash())
  app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize());
  app.use(passport.session());
  passport_config.initialize(passport);

  app.use("/", require("../../routes"));
  app.use("/api", require("../../routes/api"));
  app.use("/api", require("../../routes/apiErrorHandler"));
});

describe(" POST /api/login", () => {
  test("login succesful", async () => {
    const expectedUser =
    {
      id: "f8c79056-0b85-43ad-b740-6642d9ee5b3c",
      name: "Leon",
      email: "leon.enzenberger@protonmail.com",
      password: "$2b$10$kCzJI1ZWHN0uAZ0YFBNEFemddORcYvwwREBo.biSvGTuhcsW127JK"
    };

    UserMock.findOne.mockReturnValueOnce(new Promise((resolve, reject) => resolve(expectedUser)));

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "leon.enzenberger@protonmail.com",
        //right password
        password: "w"
      });

    expect(res.text).toBe("Found. Redirecting to /home");
    expect(res.status).toBe(302);
    expect(res.body.error).toBeFalsy();
  });

  test("login not succesful", async () => {
    const expectedUser =
    {
      id: "5e67bf8d-353b-4a1e-8eac-55ebb2b346ea",
      name: "cro",
      email: "cro@cro",
      password: "$2b$10$C6IpUs.u/HdZlONqoJ5m3u8X5MAxhm8UJ7qeTXVd2uY54V8b80CRq"
    };

    UserMock.findOne.mockReturnValueOnce(new Promise((resolve, reject) => resolve(expectedUser)));

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "cro@cro",
        //wrong
        password: "blub"
      });

    expect(res.text).toBe("Found. Redirecting to /login");
    expect(res.status).toBe(302);
    expect(res.body.error).toBeFalsy();
  });
})