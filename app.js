const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const logger = require("./util/logger");
const errorHandlers = require("./util/errorHandlers");
const configureDatabase = require("./util/database");
const models = require("./models");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const passport_config = require("./util/passportUtil");

(async () => { // allow for await use
  // load in environmental variables
  require("dotenv").config({ path: ".env" });
  const { NODE_ENV } = process.env;

  // create server
  const app = express();

  /* server configuration */
  // logging
  if (NODE_ENV === "dev")
    app.use(logger.dev);
  if (NODE_ENV === "prod") {
    app.use(logger.writeErrors);
    app.use(logger.writeRequests);
  }

  // security
  app.use(
    helmet({ contentSecurityPolicy: false })
  );

  // use pug as html template
  app.set("view engine", "pug");
  app.set("views", `${__dirname}/public/pug`);

  // serve static /js /css files
  app.use(express.static(`${__dirname}/public`));

  // cleanup req.body
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // setup db
  const db = await configureDatabase(process.env);
  app.use((req, res, next) => {
    req.db = db;

    // initialize db tables
    req.models = {
      User: models.User(db),
      Todo: models.Todo(db)
    };
    db.sync({ alter: true }); // check all tables & make them match their model
    next();
  });

  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize());
  app.use(passport.session());
  passport_config.initialize(passport);
  app.use(passport_config.returnAuthentication);

  // routes
  app.use("/", require("./routes"));
  app.use("/api", require("./routes/api"));

  // route error handling
  app.use("/api", require("./routes/apiErrorHandler"));
  app.use((req, res) => { throw new Error("Route not found"); });
  app.use(errorHandlers.notFound);

  if (NODE_ENV === "dev")
    app.use(errorHandlers.developmentErrors);
  else
    app.use(errorHandlers.productionErrors);

  // start express server
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}.`); // eslint-disable-line no-console
  });
})()
