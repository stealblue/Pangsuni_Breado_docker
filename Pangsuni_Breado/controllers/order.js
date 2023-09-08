const {stores, orders, products, users} = require("../models");
const {Sequelize, Op, NOW} = require("sequelize");

exports.addOrder = async (req, res) => {
    try {
        const loopCnt = req.body.p_no.length;
        const {p_no, o_cnt, o_pickup_dt} = req.body;
        const today = new Date();
        const pickupDay = new Date(today.setDate(today.getDate() + Number(o_pickup_dt)));
        for (let i = 0; i < loopCnt; i++) {
            if (Number(o_cnt[i]) !== 0) {
                await orders.create({
                    o_no: null,
                    u_no: req.user.u_no,
                    p_no: p_no[i],
                    o_reg_dt: Sequelize.Sequelize.literal('now()'),
                    o_pickup_dt: pickupDay,
                    o_cnt: Number(o_cnt[i])
                })
            }
        }
        res.redirect('/order/myPage');
    } catch (e) {
        console.error(e);
    }
};

exports.userOrderList = async (req, res) => {
    res.render('order/selectOneOrder', {user: req.user});
}

exports.selectListOrder = async (req, res)=>{
    try {
        const u_no = req.params.u_no;
        let limit = 10; // sql select 쿼리문의 order by limit 부분
        let offset = 0 + Number((req.query.page ? req.query.page : 1) - 1) * limit; // sql select 쿼리문의 order by offset 부분
        let checkNum = (req.query.page ? req.query.page : 1); // 페이지 네비게이션 부분에 페이징을 위한 변수 초기화
        checkNum = Math.floor(checkNum / 10) * 10; // 10자리에서 내림을 해서 10개씩 끊어주려고 위해 재할당
        const list = await orders.findAndCountAll({
            limit,
            offset,
            order:[['o_pickup_dt', 'desc'], ['o_no', 'desc']],
            where:{u_no},
            include:[{
                model:products,
                as:'p_no_product',
                required: true,
                include:{model:stores, as:'s_no_store'}
            }]
        });
        let navCheck = Math.ceil(list.count / 10) * 10; // 페이지 네비게이션을 체크하기 위한 변수로 초기화
        navCheck = navCheck / 10; // 초기화 후 쉽게 체크하기 위해 재할당
        const num = []; // 페이지 네비게이션에 나올 숫자들을 담을 배열을 선언
        for (let i = checkNum; i < checkNum + 10; i++) { // checkNum 변수를 이용해서 10개씩 담기 위한 반복문 사용
            if (i < navCheck) num.push(i + 1);
        }
        if (Number.isNaN(req.query.page) || req.query.page > navCheck) return res.status(400).json('숫자만 눌러주세요! 현재 페이지는 없습니다!');
        return res.json({orders: list, currentPage: offset, num, checkNum, user: req.user});
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
}

exports.deleteOrder = async (req, res) =>{
    console.log('컨트롤러');
    const o_no = req.body.o_no;
    try{
        await orders.destroy({
            where:{
                o_no
            }
        });
        return res.json({msg:'success'});
    }catch (err) {
        console.error(err);
        return res.status(500).json({msg: err});
    }
}

// exports.todayOrder = async (req,res)=>{
//     const u_no = req.params.u_no;
//     try{
//         const todayOrder = await orders.findAll({
//             where:{
//                 [Op.and]:[
//                     // {u_no},
//                     {o_pickup_dt:{[Op.eq]:NOW()}}
//                     // {[Op.eq]:[{o_pickup_dt:NOW()}]}
//                 ]
//             },
//             // include:[{
//             //     model:products,
//             //     as:'p_no_product',
//             //     include:[{
//             //         model:stores,
//             //         as: 's_no_store'
//             //     }]
//             // }
//             // ]
//         });
//         res.json({todayOrder:todayOrder});
//     }catch (err) {
//         console.error(err);
//         res.json({err:err});
//     }
// }