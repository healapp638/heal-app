"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.deleteDirectory = exports.makeDirectory = exports.readDirectory = exports.readFile = exports.deleteFile = exports.readHTMLFile = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const readHTMLFile = function (path) {
    return new Promise((resolve, reject) => {
        fs_1.default.promises.readFile(path, { encoding: 'utf-8' })
            .then(read => {
            resolve(read);
        })
            .catch(err => {
            reject(err);
        });
    });
};
exports.readHTMLFile = readHTMLFile;
const deleteFile = function (filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield promises_1.default.unlink(filePath);
    });
};
exports.deleteFile = deleteFile;
const readFile = function (filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // return fs.readFileSync(filePath)
            const data = yield promises_1.default.readFile(filePath, 'utf8');
            console.log(data, "fs read side ");
            return data;
        }
        catch (error) {
            console.log(error, "error file path file system side ");
        }
    });
};
exports.readFile = readFile;
const readDirectory = function (directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield promises_1.default.readdir(directoryPath);
    });
};
exports.readDirectory = readDirectory;
const makeDirectory = function (directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield promises_1.default.mkdir(directoryPath, { recursive: true });
    });
};
exports.makeDirectory = makeDirectory;
const deleteDirectory = function (directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield promises_1.default.readdir(directoryPath);
        for (const file of files) {
            yield (0, exports.deleteFile)(`${directoryPath}/${file}`);
        }
        yield promises_1.default.rmdir(directoryPath);
    });
};
exports.deleteDirectory = deleteDirectory;
const deleteFolder = function (directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield promises_1.default.rmdir(directoryPath);
    });
};
exports.deleteFolder = deleteFolder;
