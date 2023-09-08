const {regions,users,products,stores} = require("../../models");
const {Op} = require("sequelize");


exports.product = async (req, res) => {
    res.render('admin/product/selectListProduct')
};
exports.formProduct = async (req, res) => {
    const store = await stores.findAll();
    res.render('admin/product/addProduct',{store});
};
exports.addProduct = async (req, res) => {

};
exports.selectListProduct = async (req, res) => {
    try{
        let limit = 10;
        let offset = 0 + Number((req.query.page ? req.query.page : 1) - 1) * limit;
        let checkNum = (req.query.page ? req.query.page : 1);
        checkNum = Math.floor(checkNum / 10) * 10;
        const list = await products.findAndCountAll({
            limit,
            offset,
            order:[['p_no', 'desc']],
            include:[{
                model:stores,
                as:'s_no_store',
                required: true,
                include:{
                    model:regions,
                    as:'r_no_region'
                }
            }]
        });
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
        return res.json({products: list, currentPage: offset, num, checkNum, user: req.user});
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
};
exports.deleteProduct = async (req, res)=>{
    try {
        const {p_no} = req.body;
        await products.destroy({
            where: {
                p_no
            }
        });
        res.status(200).json({msg: 'success'});
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: err});
    }
}

exports.modifyFormProduct = async (req,res)=>{
    const p_no = req.params.p_no;
    const page = req.query.page;
    const product = await products.findOne({where:{p_no}});
    const store = await stores.findAll();
    res.render('admin/product/modifyPopupProduct', {product,stores:store, page});
}

exports.modifyProduct = async (req,res)=>{
    const {p_no, p_name, p_price, p_desc, s_no} = req.body;
    try{
        let product;
        if(typeof req.file == 'undefined'){
            product = await products.update({
              p_name,
              p_price,
              p_desc,
              s_no
            },{
                where:{
                    p_no
                }
            });
        }else{
            product = await products.update({
                p_name,
                p_price,
                p_desc,
                s_no,
                p_img:req.file.filename
            },{
                where:{
                    p_no
                }
            });
        }
        if(product === null){
            console.error('게시물 등록 에러');
            res.status(400).json({msg : 'uploadError'});
        }else{
            console.log('게시물 등록 완료');
            res.status(200).json({msg: 'uploadSuccess'});
        }
    }catch (err) {
        console.error(err);
        res.status(500).json({msg: err});
    }
}

