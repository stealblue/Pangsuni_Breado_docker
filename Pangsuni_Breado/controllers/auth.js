const bcrypt = require("bcrypt");
const passport = require("passport");
const { users } = require("../models");
const { Sequelize } = require("sequelize");
const smtpTransport = require('../config/mailinfo');


exports.join = async (req, res, next) => {
  const { u_id, u_pwd, u_name, u_tel, u_email } = req.body;
  console.log("req.body ,,, auth.js", req.body);
  try {
    const exUser = await users.findOne({ where: { u_id: u_id } });
    if (exUser) {
      return res.error("");
    }
    const hash = await bcrypt.hash(u_pwd, 12);
    await users.create({
      u_id,
      u_name,
      u_pwd: hash,
      u_tel,
      u_email,
      u_grade: "일반회원",
      u_reg_dt: Sequelize.Sequelize.literal("now()"),
      u_mod_dt: null,
      u_done: 1,
    });

    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.idCheck = async (req, res) => {
  const { id } = req.body;
  console.log("join--------1>", id);

  const idCheck = await users.findOne({
    where: {
      u_id: id,
    },
  });

  console.log("join--------2>", idCheck);
  if (idCheck == null) {
    return res.status(200).json({ msg: "사용가능" });
  } else {
    return res.status(500).json({ msg: "사용불가능" });
  }
};

exports.emailCheck = async (req, res) => {
  const { email } = req.body;
  console.log("email--------1>", email);

  const emailCheck = await users.findOne({
    where: {
      u_email: email,
    },
  });

  console.log("email--------2>", emailCheck);
  if (emailCheck == null) {
    return res.status(200).json({ msg: "사용가능" });
  } else {
    return res.status(500).json({ msg: "사용불가능" });
  }
};

exports.telCheck = async (req, res) => {
  const { tel } = req.body;
  console.log("email--------1>", tel);

  const telCheck = await users.findOne({
    where: {
      u_tel: tel,
    },
  });

  console.log("email--------2>", telCheck);
  if (telCheck == null) {
    return res.status(200).json({ msg: "사용가능" });
  } else {
    return res.status(500).json({ msg: "사용불가능" });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("passport.authenticalte callback ");
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      if (info.errorCode == 409) {
        return res.status(409).json({ responseText: "retiredcustomer" });
      } else {
        return res.status(401).json(info);
      }
    }
    return req.login(user, (loginErr) => {
      // 이 부분 callback 실행
      console.log("req.login callback");
      if (loginErr) {
        let error = "usernotfind";
        res.status(405).json({ responseText: error });
        // return next(loginErr);
      }
      const fillteredUser = { ...user.dataValues };

      delete fillteredUser.u_pwd;
      console.log("req.login callback->", fillteredUser);

      return res.status(200).json({ "responseText": "loginsuccess",fillteredUser, originalUrl: req.originalUrl});

      // return res.json(fillteredUser);
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

exports.findUser =(req, res) => {
  res.render("finduser", { title: "아이디/비밀번호 찾기" });
};

exports.findUsers = async (req, res, next) => {
  const { email, name } = req.body;
  console.log("email--------1>", req.body);

  const findId = await users.findOne({
    paranoid : true,
    where: {
          u_email:email,
          u_name:name
    },
  });

  console.log("email--------2>", findId);
  if (findId) {
    return res.status(200).json({ msg: "사용자 있음",findId });
  } else if(findId === null){
    return res.status(400).json({ msg: "사용자 없음" });
  }
};

exports.findUser =(req, res) => {
  res.render("finduser", { title: "아이디/비밀번호 찾기" });
};

exports.findUsersPwd = async (req, res, next) => {
  const { id, name, email } = req.body;
  console.log("email--------10>", req.body);

  const findPwd = await users.findOne({
    paranoid : true,
    where: {
          u_email:email,
          u_name:name,
          u_id:id
    }
  });

  console.log("email--------20>", findPwd);
  if (findPwd) {
    return res.status(200).json({ msg: "사용자 있음",findPwd });
  } else if(findPwd === null){
    return res.status(400).json({ msg: "사용자 없음" });
  }
};

exports.mail= async (req, res, next) => {
  const { email, title, desc, username } = req.body; // 보낼 이메일 주소, 이메일 제목, 이메일 본문, 받는 사람 이름
  try {
  // 전송하기
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com', // gmail server 사용
      port: 587,
      secure: false,
      auth: {
        user: "aldo9974@gmail.com",// 보내는 사람의 구글계정 메일 
        pass: "rnjsaldo9797!!" // 보내는 사람의 구글계정 비밀번호 (또는 생성한 앱 비밀번호)
      },
    });
    
    // 보낼 메세지
    let message = {
      from: process.env.GOOGLE_MAIL, // 보내는 사람
      to: `${username}<${email}>`, // 받는 사람 이름과 이메일 주소
      subject: title, // 메일 제목
      html: `<div // 메일 본문 -> html을 이용해 꾸며서 보낼수 있다
      style='
      text-align: center; 
      width: 50%; 
      height: 60%;
      margin: 15%;
      padding: 20px;
      box-shadow: 1px 1px 3px 0px #999;
      '>
      <h2>${username} 님, 안녕하세요.</h2> <br/> <h2>제목: ${title}</h2> <br/>${desc} <br/><br/><br/><br/></div>`,
    };
    
    // 메일이 보내진 후의 콜백 함수
    transporter.sendMail(message, (err) => {
      if (err) next(err);
      else res.status(200).json({ isMailSucssessed: true});
    });
  } catch (err) {
    next(err);
  }
};


