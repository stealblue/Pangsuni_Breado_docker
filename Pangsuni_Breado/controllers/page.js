const { Sequelize } = require("sequelize");
const {stores, users, orders, products, regions} = require("../models");

exports.renderLogin = (req, res) => {
  res.render("login", { title: "로그인" });
};

exports.renderJoin = (req, res) => {
  res.render("member/join", { title: "회원가입" });
};

exports.renderMain = async (req, res, next) => {
  // let user = null;
  // if (req.isAuthenticated()) {
  //   console.log("req:body ======>1111", req.user);
  //   user = req.user;
  // } else {
  //   user = [];
  // }
  const user = req.user;
  res.render("index", {
    title: "PangsuniBreado",
    user,
    // 메인 페이지 렌더링시 넌적스에 게시글 목록 전달
  });
  // next();
};

exports.main = async(req,res,next) => {
  console.log(req.body)
  try{
    console.log('지역번호 : ', req.body);
    // const r_no = req.params.r_no;
    const s_no = req.body.s_no;
    const storemain = await stores.findAll({
      order:Sequelize.literal('rand()'), limit:6,
      paranoid: true,
      required: false,
      nest:true
    })
    console.log('controllers : ',storemain);
    return res.status(200).json({storemain:storemain, s_no})
}catch (e) {
    console.error(e);
    return res.status(500).json({store:e});
}
}

