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

  app.use(passport.initialize());
  app.use(passport.session());
  passport_config.initialize(passport);

  app.use("/api", require("../../routes/api"));
  app.use("/api", require("../../routes/apiErrorHandler"));
});

describe(" POST /api/login", () => {
  test("success", async () => {
    const expectedUser = [
      {
        id: "f8c79056-0b85-43ad-b740-6642d9ee5b3c",
        name: "Leon",
        email: "leon.enzenberger@protonmail.com",
        password: "$2b$10$kCzJI1ZWHN0uAZ0YFBNEFemddORcYvwwREBo.biSvGTuhcsW127JK"
      }
    ];
    
    UserMock.findOne.mockReturnValueOnce(new Promise( ( resolve, reject ) => resolve( expectedUser[0] ) ));

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "leon.enzenberger@protonmail.com",
        password: "w"
      });

    //expect(res.body.errorMsg).toBe("");
    expect(res.status).toBe(302);
    expect(res.body.error).toBeFalsy();
  });
})