const {stores, products, regions} = require("../models");

exports.selectListRegionStores = async (req, res) => {
    try{
        const r_no = req.body.r_no;
        const store = await stores.findAll({where:{r_no}});
        return res.status(200).json({stores:store})
    }catch (e) {
        console.error(e);
        return res.status(500).json({store:e});
    }
};

exports.detailStore = async (req, res) => {
    const s_no = req.params.no;
    const mapAPI = process.env.KAKAO_MAP;
    console.log('KAKAO MAP : ', mapAPI);
    const store = await stores.findOne({where: {s_no}});
    const product = await products.findAll({where: {s_no}});
    res.render('store/selectOneStore', {stores: store, products: product, mapAPI:mapAPI});
};

exports.createStore = async (req, res) => {
    try {
        const region = await regions.findAll();
        res.render('store/add', {region});
    } catch (e) {
        console.error(e);
    }
};
