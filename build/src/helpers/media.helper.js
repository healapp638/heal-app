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
exports.createVideoThumbnail = exports.convertImageToWebp = void 0;
exports.readFileAsyncChunks = readFileAsyncChunks;
// import { Parser } from 'json2csv'
// import mm from 'music-metadata'
// import XLSX from 'xlsx'
// import statusCodes from '../constants/statusCodes';
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const services_1 = __importDefault(require("../services"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const path_1 = __importDefault(require("path")); //build
const convertImageToWebp = (imageInBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        (0, sharp_1.default)(imageInBuffer)
            .rotate()
            .webp({ quality: 50 })
            .toBuffer()
            .then((newBuffer) => __awaiter(void 0, void 0, void 0, function* () {
            resolve(newBuffer);
        }))
            .catch(() => {
            resolve(false);
        });
    });
});
exports.convertImageToWebp = convertImageToWebp;
function readFileAsyncChunks(filePath, bufferSize = 64 * 1024) {
    return new Promise((resolve) => {
        const stream = fs_1.default.createReadStream(filePath, { highWaterMark: bufferSize }); //each chunk buffer size will be 64 kb max
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        stream.on('error', (error) => {
            resolve(error);
        });
    });
}
// const exportJsonToExcel = (filteredData: any) => {
//     return new Promise((resolve) => {
//         try {
//             const filePath = `worksheet/${"Order"}-${new Date().getTime()}.xlsx`;
//             const workbook = XLSX.utils.book_new();
//             const orderStatus: any = {
//                 1: "new",
//                 2: "inProduction",
//                 3: "shipped",
//                 4: "error",
//                 5: "recieved",
//                 6: "cancelled"
//             }
//             const sheetArray = [
//                 'Merch Maker ID', 'Order Id', 'Customer Name', 'Customer Email', 'Customer Phone',
//                 'Order Amount', 'Order Date', 'Order Status', "Shipping Method", 'Shipping Address',
//                 "Shipping State", 'Shipping Country', "Freight Amount", "Tracking", "Ship Date",
//                 "Shipment Weight", "Dimensions", "SKU", "Product Name", 'Quantity',
//             ];
//             const sheet: any = XLSX.utils.aoa_to_sheet([sheetArray]);
//             const rowData = [];
//             for (let k = 0; k < filteredData?.length; k++) {
//                 const row = [];
//                 row.push(filteredData[k].displayId ?? '');
//                 row.push(filteredData[k].mwwOrderId ?? '');
//                 row.push(filteredData[k].userData.firstName ?? '');
//                 row.push(filteredData[k].userData.email ?? '');
//                 row.push(filteredData[k].shippingAddress.companyPhone ?? '');
//                 row.push(filteredData[k].amount ?? '');
//                 row.push(filteredData[k].orderDate ?? '');
//                 row.push(orderStatus[filteredData[k].status] ?? '');
//                 row.push(filteredData[k].shipMethodData.name ?? '');
//                 row.push(filteredData[k].shippingAddress.address1 ?? '');
//                 row.push(filteredData[k].shippingAddress.stateName ?? '');
//                 row.push(filteredData[k].shippingAddress.country ?? '');
//                 row.push(filteredData[k].freightAmount ?? '');
//                 row.push(filteredData[k].tracking ?? '');
//                 row.push(filteredData[k].shipDate ?? '');
//                 row.push(filteredData[k].shipmentWeight ?? '');
//                 row.push(filteredData[k].dimensions ?? '');
//                 row.push(filteredData[k].sku ?? '');
//                 if (filteredData[k]?.orderItems && filteredData[k]?.orderItems.length > 0) {
//                     for (let j = 0; j < filteredData[k]?.orderItems?.length; j++) {
//                         row.push(filteredData[k]?.orderItems[j]?.productTitle ?? '');
//                         row.push(filteredData[k]?.orderItems[j]?.quantity ?? '');
//                     }
//                 }
//                 rowData.push(row);
//             }
//             let counter = 1;
//             for (let k = 0; k < rowData.length; k++) {
//                 XLSX.utils.sheet_add_aoa(sheet, [rowData[k]], { origin: counter + 1 });
//                 counter++;
//             }
//             XLSX.utils.book_append_sheet(workbook, sheet, 'Orders Data');
//             const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
//             // Handling asynchronous operation directly inside Promise constructor
//             services.awsService.uploadToS3ExcelSheet(buffer, filePath)
//                 .then(excelLink => {
//                     resolve({ status: true, message: "Excel for members created Successfully!", data: excelLink, code: statusCodes.SUCCESS });
//                 })
//                 .catch(err => {
//                     resolve({ status: false, message: "Error Occurred while uploading to S3", data: err.message, code: statusCodes.API_ERROR });
//                 });
//         } catch (err: any) {
//             console.log(err);
//             resolve({ status: false, message: "Error Occurred, please try again", data: err.message, code: statusCodes.API_ERROR });
//         }
//     });
// }
// const getAudioMetadata = (mediaBuffer: any, mediaFileObj: any) => {
//     const mimeType = mediaFileObj?.mimeType || 'audio/mpeg'; // Default to MPEG audio if mimeType is not provided
//     return new Promise((resolve) => {
//         mm.parseBuffer(mediaBuffer, mimeType)
//             .then(metadata => {
//                 // console.log(metadata, "metadataaaAudio");
//                 const durationInSeconds = metadata.format.duration || 0;
//                 const formattedDuration = commonHelper.formatDuration(durationInSeconds);
//                 const song_title = metadata?.common?.title
//                 const musicMetadata = { duration: formattedDuration, title: song_title }
//                 resolve(showResponse(true, `Duration: ${durationInSeconds} seconds`, musicMetadata, statusCodes.SUCCESS));
//             })
//             .catch(error => {
//                 console.error('Error while getting metadata:', error);
//                 resolve(showResponse(false, 'Error while getting metadata', error, statusCodes.API_ERROR));
//             });
//     });
// };
// const getCSVFromJSON = (fields: any, json: any) => {
//     const parser = new Parser({ fields });
//     return parser.parse(json);
// }
const createVideoThumbnail = (video_file_name, fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const fileExtension = path_1.default.extname(video_file_name).toLowerCase();
            const videoFileName = `video-${Date.now()}${fileExtension}`;
            const videoFolderPath = `${process.cwd()}/server/views/videos`;
            if (!fs_1.default.existsSync(videoFolderPath)) {
                fs_1.default.mkdirSync(videoFolderPath, { recursive: true });
            }
            const videoPath = path_1.default.join(videoFolderPath, videoFileName);
            fs_1.default.writeFileSync(videoPath, fileBuffer);
            const output_file_name = `${video_file_name}-thumbnail.jpg`;
            const thumbnail_saved_path = `${process.cwd()}/server/views/thumbnails`;
            if (!fs_1.default.existsSync(thumbnail_saved_path)) {
                fs_1.default.mkdirSync(thumbnail_saved_path, { recursive: true });
            }
            const thumbnail_file_path = `${thumbnail_saved_path}/${output_file_name}`;
            // Check if file extension is HEVC
            if (fileExtension === '.hevc') {
                // Generate thumbnail for HEVC video
                (0, fluent_ffmpeg_1.default)(videoPath)
                    .output(thumbnail_file_path)
                    .outputOptions(['-vf', 'thumbnail', '-frames:v 1']) // Thumbnail specific options
                    .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                    // Resize the thumbnail if needed
                    const resizedThumbnail = yield (0, sharp_1.default)(thumbnail_file_path)
                        .resize(320, 240)
                        .toBuffer();
                    fs_1.default.writeFileSync(thumbnail_file_path, resizedThumbnail);
                    // Upload to S3
                    const thumbnail_file_content = fs_1.default.readFileSync(thumbnail_file_path);
                    const thumbnailUploadParams = {
                        Key: `thumbnails/${output_file_name}`,
                        Body: thumbnail_file_content,
                    };
                    try {
                        const thumb = yield services_1.default.awsService.uploadThumbnail(thumbnailUploadParams);
                        // Check if the thumbnail file exists before attempting to delete it
                        if (fs_1.default.existsSync(thumbnail_file_path)) {
                            fs_1.default.unlink(thumbnail_file_path, (unlinkErr) => {
                                if (unlinkErr) {
                                    console.error('Error deleting thumbnail:', unlinkErr);
                                    reject(unlinkErr);
                                    return;
                                }
                                console.log('Thumbnail deleted successfully');
                            });
                        }
                        else {
                            console.error('Thumbnail file does not exist:', thumbnail_file_path);
                        }
                        // Delete the video file
                        fs_1.default.unlink(videoPath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting video:', unlinkErr);
                                reject(unlinkErr);
                                return;
                            }
                            console.log('Video deleted successfully');
                        });
                        resolve(thumb.key);
                    }
                    catch (err) {
                        console.error('Error uploading thumbnail:', err);
                        reject(err);
                    }
                }))
                    .on('error', (err) => {
                    console.error('FFmpeg thumbnail error:', err);
                    reject(err);
                })
                    .run();
            }
            else {
                // Non-HEVC format (existing logic)
                (0, fluent_ffmpeg_1.default)(videoPath)
                    .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                    const thumbnail_file_content = fs_1.default.readFileSync(thumbnail_file_path);
                    const thumbnailUploadParams = {
                        Key: `thumbnails/${output_file_name}`,
                        Body: thumbnail_file_content,
                    };
                    try {
                        const thumb = yield services_1.default.awsService.uploadThumbnail(thumbnailUploadParams);
                        // Check if the thumbnail file exists before attempting to delete it.
                        if (fs_1.default.existsSync(thumbnail_file_path)) {
                            fs_1.default.unlink(thumbnail_file_path, (unlinkErr) => {
                                if (unlinkErr) {
                                    console.error('Error deleting thumbnail:', unlinkErr);
                                    reject(unlinkErr);
                                    return;
                                }
                            });
                        }
                        else {
                            console.error('Thumbnail file does not exist:', thumbnail_file_path);
                        }
                        // Delete the video file
                        fs_1.default.unlink(videoPath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting video:', unlinkErr);
                                reject(unlinkErr);
                                return;
                            }
                            console.log('Video deleted successfully');
                        });
                        resolve(thumb.key);
                    }
                    catch (err) {
                        console.error('Error uploading thumbnail:', err);
                        reject(err);
                    }
                })).on('error', (err) => {
                    console.error('FFmpeg thumbnail error:', err);
                    reject(err);
                }).screenshots({
                    timestamps: ['00:00:04'],
                    filename: thumbnail_file_path.split('/').pop(),
                    folder: thumbnail_file_path.substring(0, thumbnail_file_path.lastIndexOf('/')),
                    size: '320x240',
                });
            }
        }
        catch (err) {
            console.error('Error creating video thumbnail in catch block:', err);
            reject(err);
        }
    });
});
exports.createVideoThumbnail = createVideoThumbnail;
