const fs = require('fs');
const path = require('path');
const multer = require('multer');

try {
    fs.readdirSync('public/images');
} catch (e) {
    console.error(e);
    fs.mkdirSync('public/images');
}

exports.upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, done) {
            done(null, 'public/images/');
        },
        filename: function (req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const typeArray = file.mimetype.split('/');
        const fileType = typeArray[1];
        if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'gif' || fileType == 'webp') {
            req.fileValidationError = null;
            cb(null, true);
        } else {
            req.fileValidationError = "jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다.";
            cb(null, false)
        }
    },
    limits: {fileSize: 5 * 1024 * 1024}
});

