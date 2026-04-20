"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.processUploadedVideoAdmin = exports.completeMultipartUpload = exports.getMultipartPresignedUrl = exports.initiateMultipartUpload = exports.awsFaceRekognitionFunctions = exports.uploadQueueMediaToS3 = exports.uploadThumbnail = exports.uploadToS3 = exports.uploadToS3ExcelSheet = exports.uploadFileToS3 = exports.uploadVideoAndTranscode = exports.sendSMSService = exports.unlinkFromS3Bucket = exports.getSecretFromAWS = exports.postParameterToAWS = exports.getParameterFromAWS = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const app_constant_1 = require("../constants/app.constant");
// import * as fsHelper from '../helpers/fs.helper'
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// AWS.config.update({
//     region: APP.AWS_REGION,
//     credentials: new AWS.SharedIniFileCredentials({ profile: "" }),
// });
const path_1 = __importDefault(require("path"));
const responseMessages_1 = __importDefault(require("../constants/responseMessages"));
const mediaHelper = __importStar(require("../helpers/media.helper"));
const fs_1 = __importDefault(require("fs"));
const response_util_1 = require("../utils/response.util");
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
// Cache variables
let cachedMediaConvertEndpoint = null;
const cache = new node_cache_1.default();
const ssm = new aws_sdk_1.default.SSM();
const getParameterFromAWS = (input) => {
    const cachedValue = cache.get(input === null || input === void 0 ? void 0 : input.name);
    if (cachedValue) {
        // Return the cached value
        return Promise.resolve(cachedValue);
    }
    return new Promise((resolve) => {
        try {
            const params = {
                Name: input.name,
                WithDecryption: true,
            };
            ssm.getParameter(params, (err, data) => {
                if (err) {
                    return resolve(null);
                }
                cache.set(input.name, data.Parameter.Value);
                return resolve(data.Parameter.Value);
            });
        }
        catch (err) {
            console.log(err);
            return resolve(null);
        }
    });
};
exports.getParameterFromAWS = getParameterFromAWS;
const getMediaConvertClient = (region) => __awaiter(void 0, void 0, void 0, function* () {
    // Check Cache first
    if (cachedMediaConvertEndpoint) {
        return new aws_sdk_1.default.MediaConvert({
            region: region,
            endpoint: cachedMediaConvertEndpoint,
            accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
            secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
        });
    }
    // Fetch Endpoint if not cached
    const tempClient = new aws_sdk_1.default.MediaConvert({
        region: region,
        accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
        secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
    });
    const data = yield tempClient.describeEndpoints({}).promise();
    if (data.Endpoints && data.Endpoints.length > 0) {
        cachedMediaConvertEndpoint = data.Endpoints[0].Url || "";
        return new aws_sdk_1.default.MediaConvert({
            region: region,
            endpoint: cachedMediaConvertEndpoint,
            accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
            secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
        });
    }
    throw new Error("MediaConvert Endpoint not found");
});
const postParameterToAWS = (input) => {
    return new Promise((resolve) => {
        try {
            const params = {
                Name: input === null || input === void 0 ? void 0 : input.name,
                Type: "String",
                Value: input === null || input === void 0 ? void 0 : input.value,
                Overwrite: true,
            };
            ssm.putParameter(params, () => {
                return resolve(true);
            });
        }
        catch (error) {
            console.log(error);
            return resolve(false);
        }
    });
};
exports.postParameterToAWS = postParameterToAWS;
const getSecretFromAWS = (secret_key_param) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        try {
            const client = new aws_sdk_1.default.SecretsManager({
                region: app_constant_1.APP.AWS_REGION,
            });
            client.getSecretValue({ SecretId: secret_key_param }, (err, data) => {
                if (err) {
                    return resolve(false);
                }
                const secretKey = JSON.parse(data.SecretString);
                // let response = { SecretString: secretKey?.digismart_secret }
                const response = secretKey[secret_key_param];
                return resolve(response);
            });
        }
        catch (e) {
            console.log(e);
            return resolve(false);
        }
    });
});
exports.getSecretFromAWS = getSecretFromAWS;
const sendSMSService = (to, Message) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        var _a;
        try {
            const sns = new aws_sdk_1.default.SNS();
            const params = {
                Message,
                PhoneNumber: to,
            };
            // Send the SMS
            sns.publish(params, (err, data) => {
                var _a, _b;
                if (err) {
                    return resolve((0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.sms_sent_error, err, statusCodes_1.default.API_ERROR));
                }
                else {
                    return resolve((0, response_util_1.showResponse)(true, (_b = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _b === void 0 ? void 0 : _b.sms_sent_success, data, statusCodes_1.default.SUCCESS));
                }
            });
        }
        catch (err) {
            return resolve((0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.aws_error, err, statusCodes_1.default.API_ERROR));
        }
    });
});
exports.sendSMSService = sendSMSService;
const uploadFileToS3 = (fileArray) => __awaiter(void 0, void 0, void 0, function* () {
    const files = Array.isArray(fileArray) ? fileArray : [fileArray];
    return new Promise((resolve) => {
        var _a;
        try {
            const webpFilesArray = [];
            const promises = files.map(file => {
                const mime_type = file === null || file === void 0 ? void 0 : file.mimetype.split("/")[0];
                if (mime_type == "image" && !file.originalname.endsWith(".psd")) {
                    return mediaHelper.convertImageToWebp(file === null || file === void 0 ? void 0 : file.buffer).then(imageNewBuffer => {
                        if (imageNewBuffer) {
                            webpFilesArray.push({
                                fieldname: file.fieldname,
                                originalname: `${file.originalname}.webp`,
                                encoding: file.encoding,
                                mimetype: file.mimetype,
                                buffer: imageNewBuffer,
                                size: file.size,
                            });
                        }
                    });
                }
                else {
                    webpFilesArray.push(file);
                    return Promise.resolve(); // Return a resolved promise if no conversion is needed
                }
            });
            Promise.all(promises).then(() => {
                var _a;
                if (webpFilesArray.length > 0) {
                    uploadToS3(webpFilesArray).then(filesResponse => {
                        var _a;
                        resolve((0, response_util_1.showResponse)(true, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.file_upload_success, filesResponse, statusCodes_1.default.SUCCESS));
                    }).catch(error => {
                        var _a;
                        resolve((0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.file_upload_error, error, statusCodes_1.default.API_ERROR));
                    });
                }
                else {
                    resolve((0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.file_upload_error, null, statusCodes_1.default.API_ERROR));
                }
            }).catch(error => {
                var _a;
                resolve((0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.file_upload_error, error, statusCodes_1.default.API_ERROR));
            });
        }
        catch (err) {
            resolve((0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.file_upload_error, err, statusCodes_1.default.API_ERROR));
        }
    });
});
exports.uploadFileToS3 = uploadFileToS3;
const uploadQueueMediaToS3 = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
        secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
        region: yield app_constant_1.AWS_CREDENTIAL.REGION,
    });
    const bucketName = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
    return new Promise((resolve, reject) => {
        // Prepare a function to handle file uploads
        const uploadFiles = files.map((fileData) => {
            const { filename, mimeType, fieldName, filePath } = fileData;
            const filepath = path_1.default.join(filePath);
            const params = {
                Bucket: bucketName,
                ContentType: (mimeType === null || mimeType === void 0 ? void 0 : mimeType.indexOf("image")) >= 0 ? "image/webp" : mimeType,
                Key: `${fieldName}/${filename}`,
                Body: '',
            };
            return ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.indexOf("image")) >= 0 ?
                mediaHelper.convertImageToWebp(fs_1.default.readFileSync(filepath)) :
                Promise.resolve(fs_1.default.readFileSync(filepath))).then((body) => {
                params.Body = body;
                return s3.upload(params).promise().then((uploadResult) => {
                    // Unlink file after upload
                    fs_1.default.unlink(filepath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                        else {
                            console.log('File deleted successfully');
                        }
                    });
                    return uploadResult.Key || uploadResult.key;
                });
            });
        });
        Promise.all(uploadFiles)
            .then((uploadedKeys) => {
            resolve(uploadedKeys); // success
        })
            .catch((err) => {
            console.error('Error uploading files to S3', err);
            reject(err); // error
        });
    });
});
exports.uploadQueueMediaToS3 = uploadQueueMediaToS3;
//*******below function is working but it not use promise correctly so we recreate it above testing pending *********
// const uploadQueueMediaToS3 = async (files: any) => { //files should be in an array 
//     const s3 = new AWS.S3({
//         accessKeyId: await AWS_CREDENTIAL.ACCESSID,
//         secretAccessKey: await AWS_CREDENTIAL.AWS_SECRET,
//         region: await AWS_CREDENTIAL.REGION,
//     });
//     const bucketName = await AWS_CREDENTIAL.BUCKET_NAME;
//     return new Promise(async (resolve, reject) => {
//         try {
//             const uploadedKeys: any = [];
//             await Promise.all(files.map(async (fileData: any) => {
//                 const { filename, mimeType, fieldName, filePath } = fileData;
//                 // const extension = path.extname(filename)
//                 const filepath = path.join(filePath)
//                 const params: any = {
//                     Bucket: bucketName,
//                     ContentType: mimeType?.indexOf("image") >= 0 ? "image/webp" : mimeType,
//                     Key: `${fieldName}/${filename}`,
//                     Body: '',
//                 };
//                 if (mimeType?.indexOf("image") >= 0) {
//                     params.Body = await mediaHelper.convertImageToWebp(fs.readFileSync(filepath))
//                 } else {
//                     params.Body = fs.readFileSync(filepath)
//                 }
//                 const uploadResult: any = await s3.upload(params).promise();
//                 uploadedKeys.push(uploadResult.Key || uploadResult.key);
//                 fs.unlink(filepath, (err) => {
//                     if (err) {
//                         // console.error('Error deleting file:', err);
//                         return;
//                     }
//                 });
//             }));
//             resolve(uploadedKeys); //success
//         } catch (err) {
//             console.error('Error uploading files to S3 ', err);
//             reject(err); //error
//         }
//     });
// }
const uploadToS3ExcelSheet = (excelBuffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const ACCESSID = yield app_constant_1.AWS_CREDENTIAL.ACCESSID;
    const AWS_SECRET = yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET;
    const REGION = yield app_constant_1.AWS_CREDENTIAL.REGION;
    const BUCKET_NAME = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
    return new Promise((resolve) => {
        try {
            const s3 = new aws_sdk_1.default.S3({
                accessKeyId: ACCESSID,
                secretAccessKey: AWS_SECRET,
                region: REGION
            });
            const bucketName = BUCKET_NAME;
            const params = {
                Bucket: bucketName,
                ContentType: 'application/xlsx',
                Key: fileName,
                Body: excelBuffer
            };
            s3.upload(params, (error, data) => {
                if (error) {
                    resolve(null);
                }
                else {
                    resolve(data.key ? data === null || data === void 0 ? void 0 : data.key : data.Key);
                }
            });
        }
        catch (err) {
            resolve({ status: false, message: 'Error Occured!!', data: err.message, code: statusCodes_1.default.API_ERROR });
        }
    });
});
exports.uploadToS3ExcelSheet = uploadToS3ExcelSheet;
const uploadToS3 = (files, key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const s3 = new aws_sdk_1.default.S3({
            accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
            secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
            region: yield app_constant_1.AWS_CREDENTIAL.REGION,
        });
        const bucketName = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
        const s3UploadPromises = files.map((file) => {
            return new Promise((resolve) => {
                var _a, _b, _c, _d, _e;
                const bufferImage = key ? file : file.buffer;
                const ext = path_1.default.extname((_b = (_a = file === null || file === void 0 ? void 0 : file.originalname) !== null && _a !== void 0 ? _a : file === null || file === void 0 ? void 0 : file.fieldname) !== null && _b !== void 0 ? _b : file === null || file === void 0 ? void 0 : file.mimetype);
                let fileName = "";
                if (((_c = file === null || file === void 0 ? void 0 : file.mimetype) === null || _c === void 0 ? void 0 : _c.includes("image")) && !file.originalname.endsWith(".psd")) {
                    // image file
                    fileName = `${file.fieldname}-${Date.now().toString()}-${(_d = file === null || file === void 0 ? void 0 : file.originalname) === null || _d === void 0 ? void 0 : _d.replace('.webp', '')}.webp`;
                }
                else {
                    fileName = `${file.fieldname}-${Date.now().toString()}${ext}`;
                }
                fileName = `${file.fieldname}-${Date.now().toString()}${ext}`;
                const params = {
                    Bucket: bucketName,
                    ContentType: ((_e = file === null || file === void 0 ? void 0 : file.mimetype) === null || _e === void 0 ? void 0 : _e.includes("image")) && !file.originalname.endsWith(".psd") ? "image/webp" : file === null || file === void 0 ? void 0 : file.mimetype,
                    Key: `${file.fieldname}/${fileName}`,
                    Body: bufferImage,
                };
                s3.upload(params, (error, data) => {
                    if (error) {
                        resolve(null);
                    }
                    else {
                        resolve(data.Key || data.key);
                    }
                });
            });
        });
        const s3UploadResults = yield Promise.all(s3UploadPromises);
        return s3UploadResults;
    }
    catch (error) {
        return error;
    }
});
exports.uploadToS3 = uploadToS3;
const unlinkFromS3Bucket = (urls) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileUrls = Array.isArray(urls) ? urls : [urls];
        const s3 = new aws_sdk_1.default.S3({
            accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
            secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
            region: yield app_constant_1.AWS_CREDENTIAL.REGION,
        });
        const bucketName = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
        const unlinkFromS3Promises = fileUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const params = {
                    Bucket: bucketName,
                    Key: url,
                };
                //check if file exist in this path or not
                s3.headObject(params).promise()
                    .then(() => {
                    s3.deleteObject(params, (err, data) => {
                        if (err) {
                            // console.error('Error deleting object:', err);
                            resolve((0, response_util_1.showResponse)(false, 'Error deleting object on s3 bucket', err, statusCodes_1.default.API_ERROR));
                        }
                        else {
                            console.log('Object deleted successfully:', data);
                            resolve((0, response_util_1.showResponse)(true, 'Object deleted successfully from s3 bucket', data, statusCodes_1.default.SUCCESS));
                        }
                    });
                })
                    .catch((err) => {
                    resolve((0, response_util_1.showResponse)(false, 'item not found on s3 bucket While unlinking from s3 bucket', err, statusCodes_1.default.API_ERROR));
                });
            });
        }));
        const s3UnlinkResults = yield Promise.all(unlinkFromS3Promises);
        return s3UnlinkResults;
    }
    catch (error) {
        return error;
    }
}); //ends
exports.unlinkFromS3Bucket = unlinkFromS3Bucket;
//files -->> multer req.files  array of object 
const uploadVideoAndTranscode = (files_1, ...args_1) => __awaiter(void 0, [files_1, ...args_1], void 0, function* (files, media_type = 'videos') {
    var _a, _b, _c;
    try {
        const ACCESSID = yield app_constant_1.AWS_CREDENTIAL.ACCESSID;
        const AWS_SECRET = yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET;
        const REGION = yield app_constant_1.AWS_CREDENTIAL.REGION;
        const output_bucket_name = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
        const input_bucket_name = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
        const pipeline_id = yield getParameterFromAWS({ name: "PIPELINE_ID" });
        const cloudfront_domain = app_constant_1.APP.OUTPUT_BITBUCKET_URL; // Replace with Output Bucket CloudFront domain
        const s3 = new aws_sdk_1.default.S3({
            accessKeyId: ACCESSID,
            secretAccessKey: AWS_SECRET,
            region: REGION,
            // endpoint: `https://s3-accelerate.dualstack.amazonaws.com`, //for fast video upload
            // s3ForcePathStyle: false,
        });
        const ElasticTranscoder = new aws_sdk_1.default.ElasticTranscoder({ region: REGION, apiVersion: '2012-09-25' });
        const s3UploadPromises = files === null || files === void 0 ? void 0 : files.map((file) => {
            return new Promise((resolve) => {
                (() => __awaiter(void 0, void 0, void 0, function* () {
                    var _a, _b;
                    const ext = path_1.default.extname((_b = (_a = file === null || file === void 0 ? void 0 : file.originalname) !== null && _a !== void 0 ? _a : file === null || file === void 0 ? void 0 : file.fieldname) !== null && _b !== void 0 ? _b : file === null || file === void 0 ? void 0 : file.mimetype);
                    const fileName = `${file.fieldname}-${Date.now().toString()}${ext}`;
                    if ((file === null || file === void 0 ? void 0 : file.mimetype.indexOf("image")) >= 0) {
                        const imageNewBuffer = yield mediaHelper.convertImageToWebp(file === null || file === void 0 ? void 0 : file.buffer);
                        if (imageNewBuffer) {
                            const params = {
                                Bucket: input_bucket_name,
                                ContentType: "image/webp",
                                Key: fileName + "/" + fileName + ".webp",
                                Body: imageNewBuffer,
                            };
                            s3.upload(params, (error, data) => {
                                if (error) {
                                    resolve(null);
                                }
                                else {
                                    resolve({ thumb_url: data.Key });
                                }
                            });
                        }
                    }
                    else if ((file === null || file === void 0 ? void 0 : file.mimetype.indexOf("video")) >= 0) {
                        const folder_Key = `${file.fieldname}/${media_type}/${fileName}`;
                        const upload_params = {
                            Bucket: input_bucket_name,
                            ContentType: file === null || file === void 0 ? void 0 : file.mimetype,
                            Key: folder_Key,
                            Body: file === null || file === void 0 ? void 0 : file.buffer,
                        };
                        s3.upload(upload_params, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
                            if (error) {
                                return resolve(null);
                            }
                            const OutputKeyPrefix = `${data.Key.split('.')[0]}/`;
                            const outputs = [
                                {
                                    Key: OutputKeyPrefix + 'hls_400k',
                                    PresetId: '1351620000001-200050',
                                    SegmentDuration: '10'
                                },
                                {
                                    Key: OutputKeyPrefix + 'hls_1m',
                                    PresetId: '1351620000001-200030',
                                    SegmentDuration: '10'
                                },
                                {
                                    Key: OutputKeyPrefix + 'hls_2m',
                                    PresetId: '1351620000001-200010',
                                    SegmentDuration: '10'
                                },
                                {
                                    Key: OutputKeyPrefix + 'thumbnails/thumbnail',
                                    PresetId: '1351620000001-200030', // Preset for generating thumbnails
                                    ThumbnailPattern: OutputKeyPrefix + 'thumbnails/thumbnail-{count}',
                                }
                            ];
                            const input = { Key: data.Key };
                            const params = {
                                PipelineId: pipeline_id,
                                Input: input,
                                Outputs: outputs,
                            };
                            const jobResponse = yield ElasticTranscoder.createJob(params).promise();
                            console.log(jobResponse, "jobResponse");
                            const hls400kUrl = `${cloudfront_domain}/${OutputKeyPrefix}hls_400k.m3u8`;
                            const hls1mUrl = `${cloudfront_domain}/${OutputKeyPrefix}hls_1m.m3u8`;
                            const hls2mUrl = `${cloudfront_domain}/${OutputKeyPrefix}hls_2m.m3u8`;
                            const playlistString = "#EXTM3U\n" +
                                "#EXT-X-VERSION:3\n" +
                                "#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=640x360\n" +
                                hls400kUrl + "\n" +
                                "#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=960x540\n" +
                                hls1mUrl + "\n" +
                                "#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720\n" +
                                hls2mUrl + "\n";
                            const playlistParams = {
                                Bucket: output_bucket_name,
                                Key: `${OutputKeyPrefix}playlist.m3u8`,
                                ContentType: 'application/vnd.apple.mpegurl', // Correct MIME type
                                Body: playlistString
                            };
                            const transcode_output = {
                                video_url: `${OutputKeyPrefix}playlist.m3u8`,
                                thumb_url: `${OutputKeyPrefix}thumbnails/thumbnail-{count}`
                            };
                            const transcode_res = yield s3.putObject(playlistParams).promise();
                            if (transcode_res && transcode_res.ETag && transcode_res.ServerSideEncryption) {
                                resolve({ status: true, data: transcode_output });
                            }
                            else {
                                resolve({ status: false, data: null });
                            }
                        }));
                    }
                    else {
                        resolve({ status: false, data: null });
                    }
                }))();
            });
        });
        const s3UploadResults = yield Promise.all(s3UploadPromises);
        const transcode_result = {
            video_url: "",
            thumb_url: ""
        };
        s3UploadResults === null || s3UploadResults === void 0 ? void 0 : s3UploadResults.forEach((resp) => {
            var _a, _b, _c;
            if (resp && ((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.video_url)) {
                transcode_result.video_url = (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.video_url;
                transcode_result.thumb_url = (_c = resp === null || resp === void 0 ? void 0 : resp.data) === null || _c === void 0 ? void 0 : _c.thumb_url;
            }
        });
        if (transcode_result === null || transcode_result === void 0 ? void 0 : transcode_result.video_url) {
            return (0, response_util_1.showResponse)(true, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.file_upload_success, transcode_result, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, (_b = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _b === void 0 ? void 0 : _b.file_upload_error, null, statusCodes_1.default.API_ERROR);
    }
    catch (err) {
        return (0, response_util_1.showResponse)(false, (_c = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _c === void 0 ? void 0 : _c.file_upload_error, err, statusCodes_1.default.API_ERROR);
    }
});
exports.uploadVideoAndTranscode = uploadVideoAndTranscode;
//*******below function is working but it not use promise correctly so we recreate it above testing pending *********
// const uploadVideoAndTranscode = async (files: any, media_type = 'videos') => {
//     try {
//         const ACCESSID = await AWS_CREDENTIAL.ACCESSID
//         const AWS_SECRET = await AWS_CREDENTIAL.AWS_SECRET
//         const REGION = await AWS_CREDENTIAL.REGION
//         const output_bucket_name = await AWS_CREDENTIAL.BUCKET_NAME
//         const input_bucket_name = await AWS_CREDENTIAL.BUCKET_NAME
//         const s3 = new AWS.S3({
//             accessKeyId: ACCESSID,
//             secretAccessKey: AWS_SECRET,
//             region: REGION,
//         });
//         const pipeline_id = await getParameterFromAWS({ name: "PIPELINE_ID" })
//         const ElasticTranscoder = new AWS.ElasticTranscoder({ region: REGION, apiVersion: '2012-09-25' });
//         // let preset_high_quality = await createPreset(ElasticTranscoder)
//         // Get the URLs of the transcoded files
//         // const transcoded_video_baseUrl = await getParameterFromAWS({ name: videoBaseName })
//         // const transcoded_video_baseUrl = BUCKET_URL
//         // let fileName = Date.now().toString() + Math.floor(Math.random() * 1000);
//         const s3UploadPromises = files?.map(async (file: any) => {
//             return new Promise(async (resolve) => {
//                 const ext: any = path.extname(file?.originalname ?? file?.fieldname ?? file?.mimetype);
//                 const fileName = `${file.fieldname}-${Date.now().toString()}${ext}`;
//                 if (file?.mimetype.indexOf("image") >= 0) {
//                     const imageNewBuffer = await mediaHelper.convertImageToWebp(file?.buffer);
//                     if (imageNewBuffer) {
//                         const params = {
//                             Bucket: input_bucket_name,
//                             ContentType: "image/webp",
//                             Key: fileName + "/" + fileName + ".webp",
//                             Body: imageNewBuffer,
//                         };
//                         s3.upload(params, (error: any, data: any) => {
//                             if (error) {
//                                 resolve(null);
//                             } else {
//                                 resolve({ thumb_url: data.key });
//                             }
//                         });
//                     }
//                 } else if (file?.mimetype.indexOf("video") >= 0) { //VIDEO TRANSCODE
//                     // const fileExt = path.extname(file?.originalname)
//                     const folder_Key = `${file.fieldname}/${media_type}/${fileName}`
//                     const upload_params = {
//                         Bucket: input_bucket_name,
//                         ContentType: file?.mimetype,
//                         Key: folder_Key,
//                         Body: file?.buffer,
//                     }
//                     s3.upload(upload_params, async (error: any, data: any) => {
//                         if (error) {
//                             return resolve(null);
//                         }
//                         // Set output prefix
//                         const OutputKeyPrefix = `${data?.Key.split('.')[0]}/`; //it is the path where files stored
//                         // Set the output parameters
//                         const outputs = [
//                             {
//                                 Key: OutputKeyPrefix + 'hls_400k',
//                                 PresetId: '1351620000001-200050',
//                                 SegmentDuration: '10'
//                             },
//                             {
//                                 Key: OutputKeyPrefix + 'hls_1m',
//                                 PresetId: '1351620000001-200030',
//                                 SegmentDuration: '10'
//                             },
//                             {
//                                 Key: OutputKeyPrefix + 'hls_2m',
//                                 PresetId: '1351620000001-200010',
//                                 SegmentDuration: '10'
//                             },
//                             {
//                                 Key: OutputKeyPrefix + 'thumbnails',
//                                 PresetId: '1351620000001-200030', // Preset for generating thumbnails
//                                 ThumbnailPattern: OutputKeyPrefix + 'thumbnails/thumbnail-{count}', // Pattern for thumbnail file names
//                             }
//                         ];
//                         // Set the input parameters
//                         const input = { Key: data?.Key };
//                         // Set the job parameters
//                         const params: any = {
//                             PipelineId: pipeline_id,
//                             Input: input,
//                             Outputs: outputs,
//                         };
//                         // Create the transcoding job
//                         const jobResponse = await ElasticTranscoder.createJob(params).promise();
//                         // Extract thumbnail URLs from the job response
//                         const hls400kUrl = `${OutputKeyPrefix}hls_400k.m3u8`;
//                         const hls1mUrl = `${OutputKeyPrefix}hls_1m.m3u8`;
//                         const hls2mUrl = `${OutputKeyPrefix}hls_2m.m3u8`;
//                         // const hls400kUrl = `${transcoded_video_baseUrl}${OutputKeyPrefix}hls_400k.m3u8`;
//                         // const hls1mUrl = `${transcoded_video_baseUrl}${OutputKeyPrefix}hls_1m.m3u8`;
//                         // const hls2mUrl = `${transcoded_video_baseUrl}${OutputKeyPrefix}hls_2m.m3u8`;
//                         // Create the playlist string
//                         const playlistString = "#EXTM3U\n" +
//                             "#EXT-X-VERSION:3\n" +
//                             "#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=640x360\n" +
//                             hls400kUrl + "\n" +
//                             "#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=960x540\n" +
//                             hls1mUrl + "\n" +
//                             "#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720\n" +
//                             hls2mUrl + "\n";
//                         // Create playlist.m3u8 file
//                         const playlistParams = {
//                             Bucket: output_bucket_name,
//                             Key: `${OutputKeyPrefix}playlist.m3u8`,
//                             ContentType: 'application/x-mpegURL',
//                             Body: playlistString
//                         };
//                         const transcode_output = {
//                             video_url: playlistParams.Key,
//                             thumb_url: OutputKeyPrefix + 'thumbnails/thumbnail-{count}'
//                         }
//                         const transcode_res = await s3.putObject(playlistParams).promise();
//                         if (transcode_res && transcode_res.ETag && transcode_res.ServerSideEncryption) {
//                             resolve({ status: true, data: { ...transcode_output } });
//                         } else {
//                             resolve({ status: false, data: null });
//                         }
//                     })
//                 } else {
//                     resolve({ status: false, data: null });
//                 }
//             })
//         })
//         //resolve all promises
//         const s3UploadResults = await Promise.all(s3UploadPromises);
//         const trancode_result = {
//             video_url: "",
//             thumb_url: ""
//         }
//         s3UploadResults?.map((resp) => {
//             if (resp && resp?.data?.video_url) {
//                 trancode_result.video_url = resp?.data?.video_url
//                 trancode_result.thumb_url = resp?.data?.thumb_url
//             }
//         })
//         if (trancode_result?.video_url) {
// return showResponse(true, responseMessage?.common?.file_upload_success, trancode_result, statusCodes.SUCCESS)
//         }
// return showResponse(false, responseMessage?.common?.file_upload_error, null, statusCodes.API_ERROR)
//     } catch (err) {
// return showResponse(false, responseMessage?.common?.file_upload_error, err, statusCodes.API_ERROR)
//     }
// } //ends
//aws rekognition functions are here  step by step to search user by image 
//1. first create collection in which all faces added when user in app or web upload  
//2. second step is to add face every time user upload like for example  if user uploads profiles pic and we have to search according to profile pic then on time of upload add image in collection
//3. search image in collection after al that you have to search image addedd in collection when user uploads 
//4. list collections in aws rekognition that is created by you (optional)
const awsFaceRekognitionFunctions = {
    //provide unique id for collection you want to create
    createCollectionAwsRekognition: (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rekognition = new aws_sdk_1.default.Rekognition({
                accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
                secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
                region: yield app_constant_1.AWS_CREDENTIAL.REGION,
            });
            const params = { CollectionId: collectionId };
            const collection = yield rekognition.createCollection(params).promise();
            return (0, response_util_1.showResponse)(true, "Collections created Successfully", collection.CollectionArn, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.error('Error searching faces in collection:', error);
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) ? error.message : error, null, statusCodes_1.default.API_ERROR);
        }
    }), //ends
    //here externalImageId you can store user id to find user information after search 
    addFaceToCollectionAwsRekognition: (collectionId, imageBuffer, externalImageId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rekognition = new aws_sdk_1.default.Rekognition({
                accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
                secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
                region: yield app_constant_1.AWS_CREDENTIAL.REGION,
            });
            const params = {
                CollectionId: collectionId,
                Image: {
                    Bytes: imageBuffer,
                },
                ExternalImageId: externalImageId, // Unique ID for each face
            };
            const data = yield rekognition.indexFaces(params).promise();
            return (0, response_util_1.showResponse)(true, "Faces added Successfully", data.FaceRecords, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) ? error.message : error, null, statusCodes_1.default.API_ERROR);
        }
    }), //ends
    //search image with collection id & image buffer get it by multer or any other no need to upload image 
    searchFaceInCollectionAwsRekognition: (collectionId, imageBuffer) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const rekognition = new aws_sdk_1.default.Rekognition({
                accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
                secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
                region: yield app_constant_1.AWS_CREDENTIAL.REGION,
            });
            const params = {
                CollectionId: collectionId,
                Image: {
                    Bytes: imageBuffer,
                },
            };
            const response = yield rekognition.searchFacesByImage(params).promise();
            if (((_a = response.FaceMatches) === null || _a === void 0 ? void 0 : _a.length) == 0) {
                return (0, response_util_1.showResponse)(false, "Face Not Matched With Any Image", response.FaceMatches, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, "Faces Match Successfully", response.FaceMatches, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) ? error.message : error, null, statusCodes_1.default.API_ERROR);
        }
    }), //ends
    //list all collections in awsRekognition
    listCollectionAwsRekognition: () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const rekognition = new aws_sdk_1.default.Rekognition({
                accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
                secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
                region: yield app_constant_1.AWS_CREDENTIAL.REGION,
            });
            const params = {};
            const response = yield rekognition.listCollections(params).promise();
            const collectionIds = (_a = response === null || response === void 0 ? void 0 : response.CollectionIds) === null || _a === void 0 ? void 0 : _a.map((collectionId) => collectionId);
            return (0, response_util_1.showResponse)(true, "Collections Ids Are Here", collectionIds, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.error('Error searching faces in collection:', error);
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) ? error.message : error, null, statusCodes_1.default.API_ERROR);
        }
    }), //ends
};
exports.awsFaceRekognitionFunctions = awsFaceRekognitionFunctions;
//new
const uploadThumbnail = (thumbnailUploadParams, thumbnail_file_path) => __awaiter(void 0, void 0, void 0, function* () {
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
        secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
        region: yield app_constant_1.AWS_CREDENTIAL.REGION,
    });
    const bucketName = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
    thumbnailUploadParams.Bucket = bucketName; // Define the bucket name
    return new Promise((resolve, reject) => {
        s3.upload(thumbnailUploadParams, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (err) {
                console.error('S3 upload error:', err);
                reject({ success: false, message: 'Thumbnail upload failed', error: err });
                return;
            }
            console.log(thumbnail_file_path, "thumbnail_file_path");
            //##### Unlink The Files #######
            // fs.unlink(thumbnail_file_path, (unlinkErr: any) => {
            //     if (unlinkErr) {
            //         console.error('Error deleting file:', unlinkErr);
            //         reject(unlinkErr);
            //         return;
            //     }
            //     if (err) {
            //         console.error('Thumbnail upload error:', err);
            //         resolve(showResponse(false, responseMessage?.common?.thumbnail_error, err, statusCodes.API_ERROR));
            //         return;
            //     }
            //     resolve(showResponse(true, responseMessage?.common?.thumbnail_generated, data?.Key || data?.key, statusCodes.SUCCESS));
            // });
            return resolve({ success: true, message: ((_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.thumbnail_generated) || 'Thumbnail uploaded successfully', key: (data === null || data === void 0 ? void 0 : data.Key) || (data === null || data === void 0 ? void 0 : data.key) });
        }));
    });
});
exports.uploadThumbnail = uploadThumbnail;
// ========================Video upload Module Start ================================
// --- NEW MULTIPART UPLOAD FUNCTIONS (START) ---
const initiateMultipartUpload = (fileName, fileType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fileName || !fileType) {
            return (0, response_util_1.showResponse)(false, "File name and type are required", {}, statusCodes_1.default.VALIDATION_ERROR);
        }
        const s3 = new aws_sdk_1.default.S3({
            accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
            secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
            region: yield app_constant_1.AWS_CREDENTIAL.REGION,
            signatureVersion: 'v4',
            useAccelerateEndpoint: true,
        });
        const bucketName = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
        // Same naming convention as your original code
        const ext = fileName.substring(fileName.lastIndexOf('.'));
        const folderId = `file-${Date.now()}`;
        const key = `file/videos/${folderId}/input${ext}`;
        const params = {
            Bucket: bucketName,
            Key: key,
            ContentType: fileType,
            ACL: 'private',
        };
        const multipart = yield s3.createMultipartUpload(params).promise();
        return (0, response_util_1.showResponse)(true, "Multipart Upload Initiated", {
            uploadId: multipart.UploadId,
            key: key,
            folderId: folderId
        }, statusCodes_1.default.SUCCESS);
    }
    catch (error) {
        return (0, response_util_1.showResponse)(false, "Error initiating multipart upload", error, statusCodes_1.default.API_ERROR);
    }
});
exports.initiateMultipartUpload = initiateMultipartUpload;
const getMultipartPresignedUrl = (key, uploadId, partNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const s3 = new aws_sdk_1.default.S3({
            accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
            secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
            region: yield app_constant_1.AWS_CREDENTIAL.REGION,
            signatureVersion: 'v4',
            useAccelerateEndpoint: true,
        });
        const bucketName = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
        const params = {
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber,
            Expires: 300, // 5 minutes per link
        };
        const url = yield s3.getSignedUrlPromise('uploadPart', params);
        return (0, response_util_1.showResponse)(true, "Part URL generated", { url }, statusCodes_1.default.SUCCESS);
    }
    catch (error) {
        return (0, response_util_1.showResponse)(false, "Error generating part URL", error, statusCodes_1.default.API_ERROR);
    }
});
exports.getMultipartPresignedUrl = getMultipartPresignedUrl;
const completeMultipartUpload = (key, uploadId, parts) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const s3 = new aws_sdk_1.default.S3({
            accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
            secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
            region: yield app_constant_1.AWS_CREDENTIAL.REGION,
            useAccelerateEndpoint: true,
        });
        const bucketName = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
        // Parts must be sorted by PartNumber
        const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);
        const params = {
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: sortedParts // Array of { ETag, PartNumber } make sure
            }
        };
        const result = yield s3.completeMultipartUpload(params).promise();
        return (0, response_util_1.showResponse)(true, "Multipart Upload Completed", { location: result.Location }, statusCodes_1.default.SUCCESS);
    }
    catch (error) {
        console.error("Complete Multipart Error:", error);
        return (0, response_util_1.showResponse)(false, "Error completing upload", error, statusCodes_1.default.API_ERROR);
    }
});
exports.completeMultipartUpload = completeMultipartUpload;
// Updated to accept duration from Frontend to prevent Timeouts
const processUploadedVideoAdmin = (s3Key_1, ...args_1) => __awaiter(void 0, [s3Key_1, ...args_1], void 0, function* (s3Key, inputDuration = 0) {
    try {
        // --- 1. AWS Credentials & Configuration ---
        const REGION = yield app_constant_1.AWS_CREDENTIAL.REGION;
        const output_bucket_name = "await AWS_CREDENTIAL.OUTPUT_BUCKET_NAME";
        const input_bucket_name = yield app_constant_1.AWS_CREDENTIAL.BUCKET_NAME;
        const media_convert_role_arn = "await AWS_CREDENTIAL.MEDIA_CONVERT_ROLE_ARN";
        // We still need S3 client for internal logic if needed, but not for downloading the file anymore
        new aws_sdk_1.default.S3({
            accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
            secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
            region: REGION,
            endpoint: `https://s3-accelerate.dualstack.amazonaws.com`, //if needed
            s3ForcePathStyle: false,
        });
        // Initialize Transcribe Service
        const transcribeService = new aws_sdk_1.default.TranscribeService({
            region: REGION,
            accessKeyId: yield app_constant_1.AWS_CREDENTIAL.ACCESSID,
            secretAccessKey: yield app_constant_1.AWS_CREDENTIAL.AWS_SECRET,
        });
        // Initialize MediaConvert
        const mediaConvert = yield getMediaConvertClient(REGION);
        // --- 2. Path Construction Logic ---
        const keyParts = s3Key.split('/');
        const folderId = keyParts[keyParts.length - 2]; // e.g. file-1751991289894
        const inputFileUri = `s3://${input_bucket_name}/${s3Key}`;
        const outputKeyPrefix = `file/videos/${folderId}/`;
        const outputDestinationUri = `s3://${output_bucket_name}/${outputKeyPrefix}`;
        // --- 3. MediaConvert Job Settings ---
        const jobSettings = {
            OutputGroups: [
                {
                    Name: "Apple HLS",
                    OutputGroupSettings: {
                        Type: "HLS_GROUP_SETTINGS",
                        HlsGroupSettings: {
                            Destination: `${outputDestinationUri}hls/playlist`,
                            SegmentLength: 4,
                            MinSegmentLength: 0
                        }
                    },
                    Outputs: [
                        { NameModifier: "_hls_2m", ContainerSettings: { Container: "M3U8" }, VideoDescription: { Width: 1080, Height: 1920, ScalingBehavior: "FIT", CodecSettings: { Codec: "H_264", H264Settings: { Bitrate: 2000000, RateControlMode: "CBR", CodecProfile: "MAIN" } } }, AudioDescriptions: [{ CodecSettings: { Codec: "AAC", AacSettings: { Bitrate: 128000, SampleRate: 44100, CodecProfile: "LC", CodingMode: "CODING_MODE_2_0" } } }] },
                        { NameModifier: "_hls_1m", ContainerSettings: { Container: "M3U8" }, VideoDescription: { Width: 1080, Height: 1920, ScalingBehavior: "FIT", CodecSettings: { Codec: "H_264", H264Settings: { Bitrate: 1000000, RateControlMode: "CBR", CodecProfile: "MAIN" } } }, AudioDescriptions: [{ CodecSettings: { Codec: "AAC", AacSettings: { Bitrate: 128000, SampleRate: 44100, CodecProfile: "LC", CodingMode: "CODING_MODE_2_0" } } }] },
                        { NameModifier: "_hls_400k", ContainerSettings: { Container: "M3U8" }, VideoDescription: { Width: 1080, Height: 1920, ScalingBehavior: "FIT", CodecSettings: { Codec: "H_264", H264Settings: { Bitrate: 400000, RateControlMode: "CBR", CodecProfile: "MAIN" } } }, AudioDescriptions: [{ CodecSettings: { Codec: "AAC", AacSettings: { Bitrate: 128000, SampleRate: 44100, CodecProfile: "LC", CodingMode: "CODING_MODE_2_0" } } }] }
                    ],
                },
                {
                    Name: "Thumbnails",
                    OutputGroupSettings: {
                        Type: "FILE_GROUP_SETTINGS",
                        FileGroupSettings: { Destination: `${outputDestinationUri}thumbnails/` }
                    },
                    Outputs: [
                        // Note: NameModifier is "thumbnail-". MediaConvert will generate "thumbnail-.0000000.jpg"
                        { NameModifier: "thumbnail-", ContainerSettings: { Container: "RAW" }, VideoDescription: { Width: 1080, Height: 1920, ScalingBehavior: "FIT", CodecSettings: { Codec: "FRAME_CAPTURE", FrameCaptureSettings: { MaxCaptures: 1, Quality: 90 } } } },
                        { NameModifier: "thumbnail-cropped-", ContainerSettings: { Container: "RAW" }, VideoDescription: { Width: 1080, Height: 1280, ScalingBehavior: "FILL", CodecSettings: { Codec: "FRAME_CAPTURE", FrameCaptureSettings: { MaxCaptures: 1, Quality: 90 } } } }
                    ]
                }
            ],
            Inputs: [{
                    AudioSelectors: { "Audio Selector 1": { DefaultSelection: "DEFAULT" } },
                    VideoSelector: { Rotate: "AUTO" },
                    FileInput: inputFileUri
                }]
        };
        // --- 4. Start Jobs (Parallel Execution) ---
        const [mediaConvertJob, transcriptionJobData] = yield Promise.all([
            mediaConvert.createJob({ Role: media_convert_role_arn, Settings: jobSettings }).promise(),
            transcribeService.startTranscriptionJob({
                Media: { MediaFileUri: inputFileUri },
                TranscriptionJobName: `TranscribeJob-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                IdentifyLanguage: true,
                LanguageOptions: ["en-US", "uk-UA", "he-IL", "de-DE", "ru-RU", "es-ES"],
            }).promise()
        ]);
        if (!mediaConvertJob.Job)
            throw new Error("MediaConvert job failed to start");
        if (!transcriptionJobData.TranscriptionJob)
            throw new Error("Transcription job failed to start");
        console.log("MediaConvert Job ID:", mediaConvertJob.Job.Id);
        console.log("Transcription Job Name:", transcriptionJobData.TranscriptionJob.TranscriptionJobName);
        // --- 5. Construct Final Response URLs ---
        // Internal Data Structure
        const inputBaseName = "input";
        // If not provided, we default to 0 to avoid crashing the server by downloading the whole file.
        const videoDuration = inputDuration ? parseFloat(inputDuration) : 0;
        const responseData = {
            video_url: `${outputKeyPrefix}hls/playlist.m3u8`,
            thumbnail_url: `${outputKeyPrefix}thumbnails/${inputBaseName}thumbnail-.0000000.jpg`,
            thumbnail_crop_url: `${outputKeyPrefix}thumbnails/${inputBaseName}thumbnail-cropped-.0000000.jpg`,
            transcribeJobId: transcriptionJobData.TranscriptionJob.TranscriptionJobName,
            duration: videoDuration,
        };
        // Final Response Object
        const response = {
            transcribeJobId: responseData.transcribeJobId || "",
            videoUrl: responseData.video_url || "",
            thumbnailUrl: responseData.thumbnail_url || "",
            thumbnailCropUrl: responseData.thumbnail_crop_url || "",
            duration: responseData.duration || 0,
        };
        return (0, response_util_1.showResponse)(true, "File uploaded and processing started", response, 200);
    }
    catch (err) {
        console.error(`Error in processUploadedVideoAdmin`, err);
        return (0, response_util_1.showResponse)(false, "Processing Error", err, 500);
    }
});
exports.processUploadedVideoAdmin = processUploadedVideoAdmin;
