const {orders,users,products,stores} = require("../../models");

exports.modifyFormUser = async (req, res) => {
    const u_no = req.params.u_no;
    const page = req.query.page;
    try{
        const user = await users.findOne({
            where:{
                u_no
            }
        })
        res.render("admin/member/modifyFormUser", {user,page});
    }catch (err) {
        console.error(err);
        res.redirect('/admin/member')
    }
};
exports.modifyUser = async (req,res)=>{
    const {u_no,u_name,u_tel,u_grade,u_email} = req.body;
    try{
        const user = await users.update({
            u_name,
            u_tel,
            u_grade,
            u_email
        },{
            where:{
                u_no
            }
        })
        if(!user){
            return res.status(400).json({msg:'fail'})
        }else{
            return res.status(200).json({msg:'success'})
        }
    }catch (err){
        console.error(err);
        return res.status(500).json({msg:err});
    }
}
