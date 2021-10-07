const multer = require('multer');
const maxSize = 260 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads')
    },
    /* Creation du nom du fichier */
    filename: (req, file, callback) => {
        const espace = file.originalname.split(' ').join('_');
        const name = espace.split("'").join('_');
        callback(null, name);
        //callback(null, Date.now() + name);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/png') {
        callback(null, true)
    }else{
        callback(null,false)
    }
}

const upload = multer({storage: storage,limits: { fileSize: maxSize}, fileFilter: fileFilter});
module.exports = {upload};
