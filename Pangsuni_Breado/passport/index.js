const passport = require("passport");
const local = require("./localStrategy");

const { users } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.u_id);
  });

  passport.deserializeUser((u_id, done) => {
    users
      .findOne({ where: { u_id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
};
