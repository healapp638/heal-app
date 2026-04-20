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
exports.formatDateTOMonthDayYear = exports.generateTenDigitNumber = exports.checkRequiredFields = exports.generateOtp = exports.validateMongoIdsInArrayForJoi = exports.formatDuration = exports.convertToObjectId = exports.findClosestKey = exports.generateUsernames = exports.generateCsrfToken = exports.getCurrentDate = exports.getCountAndPagination = exports.Comma_seprator = exports.getDistanceFromLatLonInKm = exports.capitalize = exports.arraySort = exports.dynamicSort = exports.getFilterMonthDateYear = exports.camelize = exports.generateRandomOtp = exports.verifyBycryptHash = exports.bycrptPasswordHash = void 0;
exports.generateUniqueCustomerId = generateUniqueCustomerId;
exports.generateSlotsForDay = generateSlotsForDay;
exports.generateUniquePassword = generateUniquePassword;
exports.cleanCurrency = cleanCurrency;
exports.generateRandomAlphanumeric = generateRandomAlphanumeric;
exports.getFirstNameFromEmail = getFirstNameFromEmail;
exports.keysDeleteFromObject = keysDeleteFromObject;
const moment_1 = __importDefault(require("moment"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
// import { REDIS_CREDENTIAL } from '../constants/app.constant'
// import Queue from 'bull'
const crypto_1 = __importDefault(require("crypto"));
const bycrptPasswordHash = (stringValue) => {
    console.log(stringValue, "stringValue");
    return new Promise((resolve, reject) => {
        bcryptjs_1.default.genSalt(10, function (err, salt) {
            if (err) {
                reject(err.message);
            }
            bcryptjs_1.default.hash(stringValue, salt, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject(err.message);
                }
                resolve(hash);
            }));
        });
    });
};
exports.bycrptPasswordHash = bycrptPasswordHash;
const verifyBycryptHash = (password, hash_password) => {
    return bcryptjs_1.default.compare(password, hash_password);
};
exports.verifyBycryptHash = verifyBycryptHash;
const convertToObjectId = (id) => {
    return new mongoose_1.default.Types.ObjectId(id);
};
exports.convertToObjectId = convertToObjectId;
// Function to format duration from seconds to HH:MM:SS
const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.round(durationInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
exports.formatDuration = formatDuration;
const generateTenDigitNumber = () => {
    return crypto_1.default.randomInt(1000000000, 9999999999);
};
exports.generateTenDigitNumber = generateTenDigitNumber;
const generateRandomOtp = (len) => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < len; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    if (OTP.length < len || OTP.length > len) {
        generateRandomOtp(len);
    }
    return (OTP);
};
exports.generateRandomOtp = generateRandomOtp;
const camelize = (str) => {
    str = str.trim().split(' ').join('_');
    return str;
};
exports.camelize = camelize;
const getFilterMonthDateYear = (date) => {
    return (0, moment_1.default)(date).add(1, 'day').format('YYYY-MM-DD');
};
exports.getFilterMonthDateYear = getFilterMonthDateYear;
const dynamicSort = (property) => {
    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        }
        else {
            return a[property].localeCompare(b[property]);
        }
    };
};
exports.dynamicSort = dynamicSort;
const arraySort = (arr) => {
    arr.sort((a, b) => a.index > b.index
        ? 1
        : a.index === b.index
            ? a.index > b.index
                ? 1
                : -1
            : -1);
    return arr;
};
exports.arraySort = arraySort;
const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};
exports.capitalize = capitalize;
const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};
exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
const Comma_seprator = (x) => {
    if (x) {
        const parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    else {
        return x;
    }
};
exports.Comma_seprator = Comma_seprator;
//add this function where we cannot add query to get count of document example searchKey and add pagination at the end of query
const getCountAndPagination = (model, aggregate, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //this aggregation is for aggregate Model and add pagination at the end of the query aggregation
    const aggregation = [...aggregate];
    //This Aggregation is for totalCount of aggregation query 
    const pagePipelineCount = [...aggregate];
    pagePipelineCount.push({ $count: 'totalEntries' });
    const countResult = yield model.aggregate(pagePipelineCount);
    const totalCount = ((_a = countResult === null || countResult === void 0 ? void 0 : countResult[0]) === null || _a === void 0 ? void 0 : _a.totalEntries) || 0;
    // Add pagination stages if page and limit are provided
    if (page && limit) {
        page = Number(page);
        limit = Number(limit);
        aggregation.push({
            $skip: (page - 1) * limit
        }, {
            $limit: limit
        });
    }
    return { totalCount, aggregation };
}); //ends
exports.getCountAndPagination = getCountAndPagination;
function generateRandomAlphanumeric(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
function generateRandomNumeric(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10).toString();
    }
    return result;
}
const generateOtp = (length = 4) => {
    const min = Math.pow(10, (length - 1)); // Minimum number (e.g., 1000 for 4 digits)
    const max = Math.pow(10, length) - 1; // Maximum number (e.g., 9999 for 4 digits)
    return crypto_1.default.randomInt(min, max + 1);
};
exports.generateOtp = generateOtp;
function generateUniqueCustomerId() {
    // Generate an alphanumeric part (e.g., using random characters)
    const alphanumericPart = generateRandomAlphanumeric(14); // 14 characters long
    // Generate a numeric counter (e.g., using random numbers)
    const numericCounter = generateRandomNumeric(8); // 8 digits long
    // Combine the alphanumeric and numeric parts to create the unique ID
    const uniqueID = `${alphanumericPart}:${numericCounter}`;
    return uniqueID;
}
const getCurrentDate = () => {
    return (0, moment_1.default)(Date.now()).format('YYYY-MM-DD[T]HH:mm:ss.SSSSSS');
};
exports.getCurrentDate = getCurrentDate;
const generateCsrfToken = () => {
    return crypto_1.default.randomUUID();
};
exports.generateCsrfToken = generateCsrfToken;
const generateUsernames = (name, count, all_usernames = null) => {
    const usernames = [];
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < count; i++) {
        let username = name;
        for (let j = 0; j < 4; j++) {
            username += chars[Math.floor(Math.random() * chars.length)];
        }
        if (all_usernames) {
            const idx = all_usernames === null || all_usernames === void 0 ? void 0 : all_usernames.findIndex((it) => it.username == username);
            if (idx < 0) {
                usernames.push(username);
            }
        }
        else {
            usernames.push(username);
        }
    }
    return usernames;
};
exports.generateUsernames = generateUsernames;
const findClosestKey = (targetValue, obj) => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize variables to store the closest key and the minimum difference
    let closestKey = null;
    let minDifference = Infinity;
    // Iterate over each key-value pair in the object
    for (const [key, value] of Object.entries(obj)) {
        // Calculate the difference between the target value and the current value
        const difference = Math.abs(targetValue - value);
        // If the current difference is smaller than the minimum difference, update the closest key and minimum difference
        if (difference < minDifference) {
            closestKey = key;
            minDifference = difference;
        }
    }
    // Return the closest key
    return closestKey;
}); //ends
exports.findClosestKey = findClosestKey;
//example -- availability.data ==>> :[ {start_time:017411551515 , end_time:071544545}] it should be timestamp
function generateSlotsForDay(availability) {
    // Generate slots based on available time slots for the day
    const slots = availability === null || availability === void 0 ? void 0 : availability.data.flatMap((slot) => {
        const startDateTime = moment_1.default.unix(slot.start_time);
        const endDateTime = moment_1.default.unix(slot.end_time);
        const slotDuration = moment_1.default.duration(30, 'minutes');
        const generatedSlots = [];
        const currentSlotStart = startDateTime.clone();
        while (currentSlotStart.isBefore(endDateTime)) {
            const currentSlotEnd = currentSlotStart.clone().add(slotDuration);
            generatedSlots.push({
                start_time: currentSlotStart.unix(),
                end_time: currentSlotEnd.unix(),
            });
            currentSlotStart.add(slotDuration);
        }
        return generatedSlots;
    });
    return slots;
}
// generate bull queue 
// const generateQueue = (queueName: string) => {
//     const queue = new Queue(queueName, {
//         redis: {
//             port: REDIS_CREDENTIAL.PORT,
//             host: REDIS_CREDENTIAL.URI,
//         }
//     })
//     return queue
// }
//example to use platform_ids: joi.array().custom(validateMongoIdsInArrayForJoi),
// Custom Joi validator function to check if array elements are valid Mongoose ObjectIds
const validateMongoIdsInArrayForJoi = (value, helpers) => {
    // Check if the value is an array
    if (!Array.isArray(value)) {
        return helpers.error('any.invalid');
    }
    // Check each element of the array
    for (const element of value) {
        // Check if each element is a valid Mongoose ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(element)) {
            return helpers.error('any.invalid');
        }
    }
    // If all elements are valid, return the value
    return value;
};
exports.validateMongoIdsInArrayForJoi = validateMongoIdsInArrayForJoi;
function generateUniquePassword() {
    // Generate an alphanumeric part (e.g., using random characters)
    const alphanumericPart = generateRandomAlphanumeric(6);
    return alphanumericPart;
}
function cleanCurrency(value) {
    if (typeof value === 'string') {
        // Remove any dollar signs, commas, and whitespace, then convert to number
        const cleanedValue = value.replace(/[$,]/g, '').trim();
        return Number(cleanedValue);
    }
    else if (typeof value === 'number') {
        // If the value is already a number, return it as is
        return value;
    }
    else {
        // If the value is neither a string nor a number, return 0 (or handle as you prefer)
        return 0;
    }
}
// Function to check if each row has all required fields
const checkRequiredFields = (requiredHeadings, dynamicHeadings, rowsData) => {
    const missingHeadings = [];
    const allRowsHaveRequiredHeadings = rowsData.every((row, rowIndex) => {
        const missing = [];
        // Check base required headings
        requiredHeadings.forEach((heading) => {
            if (!(heading in row)) {
                missing.push(heading);
            }
        });
        // Check dynamic headings for hourly rentals (1 to 5)
        for (let i = 1; i <= 5; i++) {
            dynamicHeadings.forEach((dynamicHeading) => {
                const headingName = `${dynamicHeading} ${i}`;
                if (!(headingName in row)) {
                    missing.push(headingName);
                }
            });
        }
        // If there are missing headings, add them to missingHeadings array with the row index
        if (missing.length > 0) {
            missingHeadings.push({ rowIndex: rowIndex + 1, missing });
            return false;
        }
        return true;
    });
    return { status: allRowsHaveRequiredHeadings, missingHeadings };
};
exports.checkRequiredFields = checkRequiredFields;
const formatDateTOMonthDayYear = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};
exports.formatDateTOMonthDayYear = formatDateTOMonthDayYear;
function getFirstNameFromEmail(email) {
    return email.split('@')[0];
}
function keysDeleteFromObject(userData, keys = ['password', 'otp', 'social_account', 'is_verified']) {
    keys.forEach((key) => {
        if (key in userData) {
            delete userData[key];
        }
    });
}
