const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { users } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "u_id",
        passwordField: "u_pwd",
        passReqToCallback: false,
      },
      async (u_id, u_pwd, done) => {
        try {
          const exUser = await users.findOne({ where: { u_id } });



          if (exUser) {
            const result = await bcrypt.compare(u_pwd, exUser.u_pwd);

            console.log("exUser ----->",result);
            if (result) {
              done(null, exUser); //로그인완료
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};