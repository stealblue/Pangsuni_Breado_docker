
exports.productRegExp = (req, res, next) => {
    const nameRegExp = /^[가-힣]{1,10}$/;
    const priceRegExp = /^[0-9]{1,4}$/;
    const name = req.body.p_name;
    const price = req.body.p_price;
    console.log('name : ', name);
    console.log('price : ', price);
    console.log('body : ', req.body);
    if (!nameRegExp.test(name)) {
        return res.send('아이디 입력이 양식에 맞지 않습니다.');
    }
    if (!priceRegExp.test(price)) {
        return res.send('가격 입력이 양식에 맞지 않습니다.');
    }
    next();
}