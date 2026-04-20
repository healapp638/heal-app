"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMSWithAwsSNS = void 0;
// import twillioClient from 'twilio'
// import { SMS_CREDENTIAL } from '../constants/app.constant';
const response_util_1 = require("../utils/response.util");
const responseMessages_1 = __importDefault(require("../constants/responseMessages"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
// const sendSMSWithTwillio = async (to: string, body: string) => {
//     try {
//         const twillio_sid = await SMS_CREDENTIAL.TWILIO_ACCOUNT_SID
//         const twillio_auth = await SMS_CREDENTIAL.TWILIO_AUTH_TOKEN
//         const client = twillioClient(twillio_sid, twillio_auth);
//         const response = await client.messages.create({
//             body,
//             from: SMS_CREDENTIAL.SEND_FROM_HOST,
//             to
//         });
//         return response.sid
//     } catch (err: any) {
//         console.log(err, "error twilio")
//         return err;
//     }
// }
const sendSMSWithAwsSNS = (to, Message) => {
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
};
exports.sendSMSWithAwsSNS = sendSMSWithAwsSNS;
