const {next} = require("lodash/seq");
const requestIp = require('request-ip');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect(`/login`);
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/`);
  }
};

exports.whoisAdmin = (req, res, next)=>{
  if(req.user.u_grade === '관리자'){
    next();
  }else{
    res.redirect(`/`);
  }
}

