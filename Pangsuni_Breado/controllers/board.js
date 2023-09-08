const {board, comments,users,board_type} = require("../models");
const {Sequelize, Op} = require("sequelize");

exports.selectListBoard = async (req, res) => {
    try {
        const bt_no = req.params.bt_no;
        res.render('board/selectListBoard',{bt_no});
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
}

exports.selectListBoard2 = async (req, res) => {
    try {
        const bt_no = req.params.bt_no;
        // console.log('bt_no : ', bt_no);
        let where = {
            bt_no
        };
        if (req.query.keyword) {
            const {searchType, keyword} = req.query;
            if (searchType === 'any') {
                where = {
                    bt_no,
                    [Op.or]: [
                        {b_content:{[Op.like]:[`%${keyword}%`]}},
                        {b_title:{[Op.like]:[`%${keyword}%`]}},
                    ]
                }
            } else if (searchType === 'b_content') {
                where = {
                    bt_no,
                    b_content:{[Op.like]:[`%${keyword}%`]}
                }
            } else {
                where = {
                    bt_no,
                    b_title:{[Op.like]:[`%${keyword}%`]}
                }
            }
        }
        let limit = 10; // sql select 쿼리문의 order by limit 부분
        let offset = 0 + Number((req.query.page ? req.query.page : 1) - 1) * limit; // sql select 쿼리문의 order by offset 부분
        let checkNum = (req.query.page ? req.query.page : 1); // 페이지 네비게이션 부분에 페이징을 위한 변수 초기화
        checkNum = Math.floor(checkNum / 10) * 10; // 10자리에서 내림을 해서 10개씩 끊어주려고 위해 재할당
        const qnaList = await board.findAndCountAll({ // 검색결과와 전체 count를 같이 보기 위해 사용
            limit: 10,
            offset: offset,
            order: [['b_no', 'desc']], // 최신부터 보여주기 위해 역순으로 정렬
            where,
            include:{
                model: users,
                as:'u_no_user'
            }
        })
        let navCheck = Math.ceil(qnaList.count / 10) * 10; // 페이지 네비게이션을 체크하기 위한 변수로 초기화
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
        return res.json({board: qnaList, currentPage: offset, num, checkNum, user: req.user});
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
}

exports.addBoard = async (req, res, next) => {
    console.log(req.body);
    const u_no = req.user.u_no;
    const {bt_no, u_id, b_title, b_content} = req.body;
    try {
        await board.create({
            b_no: null,
            bt_no,
            u_no,
            b_title,
            b_content,
            b_done: 1,
            b_cnt: 0,
        });
        console.log(req.body);
        // res.send("QnA 등록완료!!");
        res.redirect(`/board/list/${bt_no}`);
    } catch (e) {
        console.error(e);
        next(e);
    }
};
// selectListBoard.html / 게시글 처음에서 글쓰기----------
exports.formBoard = (req, res) => {
    console.log('글쓰기에 들어오는창');
    const bt_no = req.params.bt_no;
    res.render("board/addBoard",{bt_no});
};

exports.selectOneBoard = async (req, res) => {
    const {bt_no} = req.query;
    const b_no = req.params.no;
    const boards = await board.findOne({
        where: {
            b_no
        }
    });
    console.log('cookies : ', req.cookies);
    if (req.cookies['f' + b_no] == undefined){
        const addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        res.cookie('f' + b_no, addr, {
            maxAge: 30000
        })
        await board.update({
            b_cnt : boards.b_cnt + 1
        }, {
            where: {
                b_no
            }
        });
    }
    const commentList = await comments.findAll({
        where: {
            b_no: req.params.no
        }
    })
    res.render("board/selectOneBoard", {boards, commentList,bt_no})
}
// selectListBoard.html / 게시글 처음에서 댓글달기(comments)----------
exports.CommentView = async (req, res) => {
    const boardNo = req.params.no;
    res.render("qna/commentsadd", {bNo: boardNo}); //(뷰,데이터)
};

exports.CommentWrite = async (req, res) => {
    console.log('userID : ', req.user);
    await comments.create({
        c_no: null,
        b_no: req.body.b_no,
        u_no: req.body.u_no,
        c_content: req.body.c_content,
        c_reg_dt: Sequelize.Sequelize.literal('now()'),
        c_mod_dt: null
    })
    res.redirect(`/qna/view/${req.body.b_no}`);
}

exports.CommentAdd = async (req, res) => {
    console.log('comment : ', req.body);
    const {b_no, u_no, c_content} = req.body;
    await comments.create({
        c_no: null,
        b_no,
        u_no,
        c_content,
        c_reg_dt: Sequelize.Sequelize.literal('now()'),
        c_mod_dt : null
    });
    res.redirect(`/board/view/${req.body.b_no}`);
};
// 게시판 글 삭제 버튼
exports.deleteBoard = async (req, res)=>{
    try{
        const {bt_no} = req.query;
        const { b_no } = req.params;
        await board.destroy({
            where:{
                b_no
            }
        });
        res.redirect(`/board/list/${bt_no}`);
    }catch (e) {
        console.error(e);
        res.status(400).json(e);
    }
}

exports.modifyFormBoard = async (req, res)=>{
    const {b_no} = req.params;
    try{
        const boards = await board.findOne({
            where:{
                b_no
            }
        });
        res.render('board/modifyForm',{boards});
    }catch (err) {
        console.error(err);
        res.json({err});
    }
}

exports.modifyBoard = async (req,res)=>{
    const{b_title, b_content,bt_no, b_no} = req.body;
    try{
        await board.update({
            b_title,
            b_content,
            b_mod_dt:Sequelize.Sequelize.literal('now()')
        },{
            where:{
                b_no
            }
        });
        res.redirect(`/board/view/${b_no}?bt_no=${bt_no}`);
    }catch (err) {
        console.error(err);
        res.json({err});
    }
}