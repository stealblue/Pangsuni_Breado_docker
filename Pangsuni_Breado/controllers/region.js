const {regions,stores} = require("../models");

exports.selectListRegions = async (req, res) => {
    try{
        const regionList = await regions.findAll();
        const seoulStore = await stores.findAll({where:{r_no:1}})
        res.render('store/selectListStore', {regions:regionList, seoulStore});
    }catch (e) {
        console.error(e);
    }
};