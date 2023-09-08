const {regions,users,products,stores,board} = require("../../models");
const {Sequelize} = require("sequelize");
const {selectOneBoard} = require("../board");


exports.addFormBoard = async (req, res) => {
    res.render('admin/board/adminAddBoard');
};

exports.adminModifyBoard = async (req,res)=>{
    const b_no = req.params.b_no;
    const boards = await board.findOne({where:{b_no}});
    res.render('admin/board/adminModifyBoard', {board:boards});
}

exports.adminModifyBoardPost = async(req, res) => {
    const {b_no, b_title, b_content}=req.body;
    console.log(b_no);
    console.log(b_title);
    console.log(b_content);
    try{
        const boards =await board.update({
            b_title,
            b_content,
            b_mod_dt:Sequelize.Sequelize.literal('now()')
        },{
            where:{
                b_no
            }
        });
        if(boards === null){
            return res.status(400).json({msg:'updateError'});
        }
        return res.status(200).json({msg:'success'});
    }catch (err) {
        console.error(err);
        return res.status(500).json({msg:err});
    }
}

exports.deleteBoard = async (req, res)=>{
    try{
        const {b_no} = req.body;
        await board.destroy({
            where:{b_no}
        });
        return res.json({msg: '성공'});
    }catch (e) {
        console.error(e);
        return res.status(500).json({msg:'실패!'});
    }
}

exports.adminBoard = async (req, res) => {
    res.render("admin/board/board", { title: "게시판관리"});
};

exports.adminSelectListBoard = async (req, res) => {
    try {
        let limit = 10; // sql select 쿼리문의 order by limit 부분
        let offset = 0 + Number((req.query.page ? req.query.page : 1) - 1) * limit; // sql select 쿼리문의 order by offset 부분
        let checkNum = (req.query.page ? req.query.page : 1); // 페이지 네비게이션 부분에 페이징을 위한 변수 초기화
        checkNum = Math.floor(checkNum / 10) * 10; // 10자리에서 내림을 해서 10개씩 끊어주려고 위해 재할당
        const qnaList = await board.findAndCountAll({ // 검색결과와 전체 count를 같이 보기 위해 사용
            limit: 10,
            offset: offset,
            order: [['b_no', 'desc']], // 최신부터 보여주기 위해 역순으로 정렬
            include:{
                model:users,
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
};

exports.selectOneBoard = async (req, res)=>{
    const b_no = req.params.b_no;
    const {bt_no} = req.query;
    console.log('b_no : ',b_no);
    try{
       const selectOneBoard = await board.findOne({
            where:{
                b_no
            }
        });
        res.render('admin/board/selectOneBoard', {boards:selectOneBoard,bt_no});
    }catch (err) {
        console.error(err)
        res.json(err);
    }
}
