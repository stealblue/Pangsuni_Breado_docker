const {orders,users,products,stores} = require("../../models");
const {Sequelize, Op} = require("sequelize");
exports.adminOrder = async (req, res) => {
    res.render("admin/order/listOrder", {title: "주문관리", user: req.user});
};

exports.selectListOrder = async (req, res) => {
    try {
        let limit = 10; // sql select 쿼리문의 order by limit 부분
        let offset = 0 + Number((req.query.page ? req.query.page : 1) - 1) * limit; // sql select 쿼리문의 order by offset 부분
        let checkNum = (req.query.page ? req.query.page : 1); // 페이지 네비게이션 부분에 페이징을 위한 변수 초기화
        checkNum = Math.floor(checkNum / 10) * 10; // 10자리에서 내림을 해서 10개씩 끊어주려고 위해 재할당
        const {searchType, keyword} =req.query;
        console.log(searchType);
        console.log(keyword);
        let where = {
            o_no: {
                [Op.like]: [`%${keyword}%`]
            }
        };
        if(searchType === 'p_name') {
            const selectColumn = 'p_no';
            const fromModel = 'products';
            const as = 'p_no_product';
            const subQuery =Sequelize.literal(`(
                    select ${selectColumn} 
                    from ${fromModel} as ${as}
                    where ${as}.${searchType} like '%${keyword}%'
                    )`);
            where = {
                p_no: {
                    [Op.in]: [
                        subQuery
                    ]
                }
            };
        }else if(searchType === 'u_id'){
            const selectColumn = 'u_no';
            const fromModel = 'users';
            const as = 'u_no_user';
            const subQuery =Sequelize.literal(`(
                    select ${selectColumn} 
                    from ${fromModel} as ${as}
                    where ${as}.${searchType} like '%${keyword}%'
                    )`);
            where = {
                u_no: {
                    [Op.in]: [
                        subQuery
                    ]
                }
            };
        }else if(searchType === 's_name'){
            const selectColumn = 's_no';
            const fromModel = 'stores';
            const as = 's_no_store';
            const subQuery = Sequelize.literal(`(select p_no_product.p_no 
                        from products as p_no_product 
                        where p_no_product.s_no in (select ${as}.${selectColumn} 
                                                    from ${fromModel} as ${as} where ${as}.${searchType} like '%${keyword}%'))`);
            where = {
                p_no: {
                    [Op.in]: [
                        subQuery
                    ]
                }
            };

            // const result = searchResult(req,checkNum, offset, list);
            // return res.json({result});
        }else{
            // const list = await orders.findAndCountAll({
            //     limit,
            //     offset,
            //     order:[['o_no', 'desc']],
            //     include:[{
            //         model:products,
            //         as:'p_no_product',
            //         required: true,
            //         include:{
            //             model:stores,
            //             as:'s_no_store'
            //         }
            //     },{
            //         model:users,
            //         as:'u_no_user',
            //         required:true
            //     }]
            // });
            // const result = searchResult(req,checkNum, offset, list);
            // return res.json({result});
        }
        const list = await orders.findAndCountAll({
            limit,
            offset,
            order:[['o_no', 'desc']],
            include:[{
                model:products,
                as:'p_no_product',
                include:{
                    model:stores,
                    as:'s_no_store'
                }
            },{
                model:users,
                as:'u_no_user'
            }],
            where
        });
        // const list = await orders.findAndCountAll({
        //   limit,
        //   offset,
        //   order:[['o_no', 'desc']],
        //   include:[{
        //     model:products,
        //     as:'p_no_product',
        //     required: true,
        //       include:{
        //         model:stores,
        //           as:'s_no_store'
        //       }
        //   },{
        //     model:users,
        //     as:'u_no_user',
        //     required:true
        //   }]
        // });
// const result = searchResult(req,checkNum, offset, list);
// return res.json({result});
        let navCheck = Math.ceil(list.count / 10) * 10; // 페이지 네비게이션을 체크하기 위한 변수로 초기화
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
        return res.json({orders: list, currentPage: offset, num, checkNum, user: req.user});
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
};

exports.searchForm = async (req, res)=>{
    res.render('admin/order/searchFormOrder');
}

const searchResult = (req, checkNum, offset,list) => {
    let navCheck = Math.ceil(list.count / 10) * 10; // 페이지 네비게이션을 체크하기 위한 변수로 초기화
    navCheck = navCheck / 10; // 초기화 후 쉽게 체크하기 위해 재할당
    const num = []; // 페이지 네비게이션에 나올 숫자들을 담을 배열을 선언
    for (let i = checkNum; i < checkNum + 10; i++) { // checkNum 변수를 이용해서 10개씩 담기 위한 반복문 사용
        if (i < navCheck) {
            num.push(i + 1);
        }
    }
    if (Number.isNaN(req.query.page) || req.query.page > navCheck) {
        return '숫자만 눌러주세요! 현재 페이지는 없습니다!';
    }
    return {orders: list, currentPage: offset, num, checkNum, user: req.user};
}