"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const app_constant_1 = require("../constants/app.constant");
const addToMulter = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, callback) => {
        callback(null, true); // Accept the file
    },
    limits: { fileSize: app_constant_1.APP.FILE_SIZE * 1024 * 1024 } // in MB
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'documents') {
            cb(null, `${process.cwd()}/public/uploads/documents`);
        }
        else {
            cb(null, `${__dirname}/public/uploads`);
        }
    },
    filename(req, file, cb) {
        const num = Math.round(Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10)).toString(36).slice(1);
        const fileName = num + file.originalname;
        cb(null, fileName);
    },
});
const fileFilter = function (req, file, callback) {
    // const mime = file.mimetype;
    // if (!mime.includes('image') && !mime.includes('pdf')) {
    //     return callback(new Error("Only image or pdf files are allowed"));
    // }
    callback(null, true);
};
const multerUpload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter
});
exports.default = {
    addToMulter,
    multerUpload
};
