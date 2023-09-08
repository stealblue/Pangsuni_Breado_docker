const {comments, board, users} = require("../models");
const {Sequelize} = require("sequelize");

exports.selectListComment = async (req, res) => {
    const b_no = req.params.b_no;
    try {
        let limit = 10; // sql select 쿼리문의 order by limit 부분
        let offset = 0 + Number((req.query.page ? req.query.page : 1) - 1) * limit; // sql select 쿼리문의 order by offset 부분
        let checkNum = (req.query.page ? req.query.page : 1); // 페이지 네비게이션 부분에 페이징을 위한 변수 초기화
        checkNum = Math.floor(checkNum / 10) * 10; // 10자리에서 내림을 해서 10개씩 끊어주려고 위해 재할당
        const commentList = await comments.findAndCountAll({ // 검색결과와 전체 count를 같이 보기 위해 사용
            limit: 10,
            offset: offset,
            order: [['c_no', 'desc']], // 최신부터 보여주기 위해 역순으로 정렬
            where: {
                b_no
            },
            include: [{
                model: board,
                as: 'b_no_board'
            }, {
                model: users,
                as: 'u_no_user'
            }]
        });
        let navCheck = Math.ceil(commentList.count / 10) * 10; // 페이지 네비게이션을 체크하기 위한 변수로 초기화
        navCheck = navCheck / 10; // 초기화 후 쉽게 체크하기 위해 재할당
        const num = []; // 페이지 네비게이션에 나올 숫자들을 담을 배열을 선언
        for (let i = checkNum; i < checkNum + 10; i++) { // checkNum 변수를 이용해서 10개씩 담기 위한 반복문 사용
            if (i < navCheck) {
                num.push(i + 1);
            }
        }
        if (Number.isNaN(req.query.page) || req.query.page > navCheck) {
            return res.status(400).json('숫자만 눌러주세요! 현재 페이지는 없습니다!');
        }
        return res.json({comments: commentList, currentPage: offset, num, checkNum, user: req.user});
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
};

exports.addComment = async (req, res) => {
    console.log('req.body : ', req.body);
    const {b_no, u_no, c_content} = req.body;
    try{
        const comment = await comments.create({
            c_no:null,
            b_no,
            u_no,
            c_content,
            c_reg_dt: Sequelize.Sequelize.literal('now()'),
            c_mod_dt: null
        });
        if(comment === null){
            return res.status(400).json({msg: 'fail'});
        }else{
            return res.status(200).json({msg: 'success'});
        }
    }catch (err) {
        console.error(err);
        return res.status(500).json({msg: err});
    }
}

exports.selectOneComment = async (req,res)=>{
    try{
        const c_no = req.params.c_no;
        const comment = await comments.findOne({
            where:{
                c_no
            }
        });
        res.json({comment:comment});
    }catch (err) {
        console.error(err);
        res.status(500).json({msg: err})
    }
}

exports.modifyComment = async (req, res)=>{
    try{
        console.log('controller c_no : ',req.body.c_no);
        const {c_no,c_content} = req.body;
        await comments.update({
            c_content,
            c_mod_dt:Sequelize.Sequelize.literal('now()')
        },{
            where:{
                c_no
            }
        })
        res.json({msg: 'success'});
    }catch (err) {
        console.error(err);
        res.status(500).json({msg: err});
    }
}