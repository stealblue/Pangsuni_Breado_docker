const {stores,regions} = require("../../models");

exports.adminStore = async (req, res) => {
    try {
        res.render('admin/store/adminSelectListStore');
    } catch (err) {
        console.error(err);
    }
};

exports.selectListStore = async (req, res) => {
    try {
        let limit = 10; // sql select 쿼리문의 order by limit 부분
        let offset = 0 + Number((req.query.page ? req.query.page : 1) - 1) * limit; // sql select 쿼리문의 order by offset 부분
        let checkNum = (req.query.page ? req.query.page : 1); // 페이지 네비게이션 부분에 페이징을 위한 변수 초기화
        checkNum = Math.floor(checkNum / 10) * 10; // 10자리에서 내림을 해서 10개씩 끊어주려고 위해 재할당
        const list = await stores.findAndCountAll({ // 검색결과와 전체 count를 같이 보기 위해 사용
            limit,
            offset,
            order: [['s_no', 'desc']], // 최신부터 보여주기 위해 역순으로 정렬
            // order:{},
            include:{
                model:regions,
                as:'r_no_region',
                required:true
            }
        })
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
        return res.json({stores: list, currentPage: offset, num, checkNum, user: req.user});
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
};

exports.deleteStore = async (req, res) => {
    try {
        const {s_no} = req.body;
        await stores.destroy({
            where: {
                s_no
            }
        });
        res.status(200).json({msg: 'success'});
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: err});
    }
}

exports.selectOneStore = async (req,res)=>{
    try{
        const s_no = req.params.s_no;
        const store = await stores.findOne({
            where:{
                s_no,
            },
            include:{
                model:regions,
                as:'r_no_region'
            }
        });
        const region = await regions.findAll();
        res.render('admin/store/adminSelectOneStore',{store,regions:region});
    }catch (err) {
        console.error(err);
        res.status(500).json({msg: err});
    }
}

exports.addStore = async (req,res)=>{
    console.log('들어오는가');
    try{
        const region = await regions.findAll();
        res.render('admin/store/adminAddStore',{regions:region});
    }catch (err) {
        console.error(err);
    }
}

exports.addStore2 = async (req, res)=>{
    const {s_name, r_no, s_desc, s_addr, s_tel} =req.body;
    try{
        const store = await stores.create({
            s_no:null,
            s_name,
            r_no,
            s_desc,
            s_addr,
            s_tel,
            s_img:req.file.filename
        })
        if(store === null){
            console.log('등록 실패');
            res.status(400).json({msg:'UploadError'});
        }
        else{
            console.log('등록 완료');
            res.status(200).json({msg: 'uploadSuccess'});
        }
    }catch (err) {
        console.error(err);
        res.status(500).json({msg: err});
    }
}

exports.modifyStore = async (req,res)=>{
    const {s_no, s_name, s_desc, s_tel, r_no, s_addr} = req.body;
    try {
        let store;
        if(typeof req.file == 'undefined'){
            store = stores.update({
                s_name,
                s_desc,
                s_tel,
                r_no,
                s_addr
            }, {
                where: {
                    s_no
                }
            })
        }else{
            store = stores.update({
                s_name,
                s_desc,
                s_tel,
                r_no,
                s_addr,
                s_img: req.file.filename,
            }, {
                where: {
                    s_no
                }
            })
        }
        if(store === null){
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