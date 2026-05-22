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
exports.sendEmailViaNodemail = exports.sendEmailViaSendGrid = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const response_util_1 = require("../utils/response.util");
const app_constant_1 = require("../constants/app.constant");
const workflow_constant_1 = require("../constants/workflow.constant");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const responseMessages_1 = __importDefault(require("../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
// const nodemail = async (to: string, subject: string, body: any, attachments: any = []): Promise<ApiResponse> => {
//     const EMAIL_HOST = await EMAIL_CREDENTIAL.EMAIL_HOST
//     const SMTP_EMAIL = await EMAIL_CREDENTIAL.SMTP_EMAIL
//     const SMTP_API_KEY = await EMAIL_CREDENTIAL.SMTP_API_KEY
//     console.log(EMAIL_HOST,"EMAIL_HOST")
//     console.log(SMTP_EMAIL,"SMTP_EMAIL")
//     console.log(SMTP_API_KEY,"SMTP_API_KEY")
//     return new Promise((resolve) => {
//         try {
//             const transporter = nodemailer.createTransport({
//                 host: EMAIL_HOST,
//                 port: 465,
//                 secure: true,
//                 auth: {
//                     user: SMTP_EMAIL,
//                     pass: SMTP_API_KEY
//                 }
//             });
//              console.log("before verify");
//         console.log("after verify");
//             const mailOptions = {
//                 from: SMTP_EMAIL,
//                 to,
//                 subject,
//                 html: body,
//                 attachments
//             }
//                 console.log("before send");
//              transporter.sendMail(mailOptions, (error: any, data: any) => {
//                 if (error) {
//                     return resolve(showResponse(false, responseMessages.common.email_sent_error, error, statusCodes.API_ERROR));
//                 }
//                 return resolve(showResponse(true, responseMessages.common.email_sent_success, data, statusCodes.SUCCESS));
//             })
//         } catch (err) {
//             return resolve(showResponse(false, responseMessages.common.email_sent_error, err, statusCodes.API_ERROR));
//         }
//     });
// }//ends
const nodemail = (to_1, subject_1, body_1, ...args_1) => __awaiter(void 0, [to_1, subject_1, body_1, ...args_1], void 0, function* (to, subject, body, attachments = []) {
    try {
        const EMAIL_HOST = app_constant_1.EMAIL_CREDENTIAL.EMAIL_HOST;
        const SMTP_EMAIL = app_constant_1.EMAIL_CREDENTIAL.SMTP_EMAIL;
        const SMTP_API_KEY = app_constant_1.EMAIL_CREDENTIAL.SMTP_API_KEY;
        // console.log(EMAIL_HOST, "EMAIL_HOST");
        // console.log(SMTP_EMAIL, "SMTP_EMAIL");
        const transporter = nodemailer_1.default.createTransport({
            host: EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: SMTP_EMAIL,
                pass: SMTP_API_KEY
            }
        });
        // console.log("before verify");
        yield transporter.verify();
        // console.log("after verify");
        const mailOptions = {
            from: SMTP_EMAIL,
            to,
            subject,
            html: body,
            attachments
        };
        // console.log("before send");
        const data = yield transporter.sendMail(mailOptions);
        // console.log(data, "mail success");
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.email_sent_success, data, statusCodes_1.default.SUCCESS);
    }
    catch (err) {
        console.log(err, "mail error");
        return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, err, statusCodes_1.default.API_ERROR);
    }
});
const sendgridMail = (to_1, subject_1, body_1, ...args_1) => __awaiter(void 0, [to_1, subject_1, body_1, ...args_1], void 0, function* (to, subject, body, attachments = []) {
    const SENDGRID_FROM_EMAIL = yield app_constant_1.EMAIL_CREDENTIAL.SMTP_EMAIL;
    const SENDGRID_API_KEY = yield app_constant_1.EMAIL_CREDENTIAL.SMTP_API_KEY;
    mail_1.default.setApiKey(SENDGRID_API_KEY);
    // console.log(SENDGRID_FROM_EMAIL,"SENDGRID_FROM_EMAIL")
    // console.log(SENDGRID_API_KEY,"SENDGRID_API_KEY")
    return new Promise((resolve) => {
        try {
            const mailOptions = {
                to: to,
                from: SENDGRID_FROM_EMAIL,
                subject,
                html: body,
                attachments
            };
            mail_1.default.send(mailOptions).then(() => {
                return resolve((0, response_util_1.showResponse)(true, responseMessages_1.default.common.email_sent_success, null, statusCodes_1.default.SUCCESS));
            }).catch((error) => {
                return resolve((0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, error, statusCodes_1.default.API_ERROR));
            });
        }
        catch (err) {
            return resolve((0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, err, statusCodes_1.default.API_ERROR));
        }
    });
}); //ends
const sendEmail = (emailType_1, recipientEmail_1, body_1, transportMethod_1, ...args_1) => __awaiter(void 0, [emailType_1, recipientEmail_1, body_1, transportMethod_1, ...args_1], void 0, function* (emailType, recipientEmail, body, transportMethod, useLocalLogo = true) {
    try {
        const { user_name, otp, html, magic_link } = body;
        const to = recipientEmail;
        let template = '';
        let subject = '';
        const logoPath = useLocalLogo
            ? path_1.default.join(process.cwd(), './public', 'logo.png')
            : `${app_constant_1.APP.BITBUCKET_URL}/${app_constant_1.APP.PROJECT_LOGO}`;
        console.log(logoPath, "logoPath");
        const attachments = useLocalLogo ? [{
                filename: 'logo.png',
                path: logoPath,
                cid: 'unique@Logo',
            }] : [];
        console.log(magic_link, "magic_link");
        const email_payload = {
            project_name: app_constant_1.APP.PROJECT_NAME,
            user_name,
            project_logo: useLocalLogo ? null : logoPath,
            cidLogo: useLocalLogo ? 'unique@Logo' : '',
            magic_link: magic_link
        };
        switch (emailType) {
            case workflow_constant_1.EMAIL_SEND_TYPE.REGISTER_EMAIL:
                email_payload.otp = otp;
                subject = 'New user registered';
                template = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), './src/templates', 'registration.ejs'), email_payload);
                break;
            case workflow_constant_1.EMAIL_SEND_TYPE.FORGOT_PASSWORD_EMAIL:
                email_payload.otp = otp;
                subject = 'Forgot Password';
                template = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), './src/templates', 'forgotPassword.ejs'), email_payload);
                break;
            case workflow_constant_1.EMAIL_SEND_TYPE.SEND_OTP_EMAIL:
                email_payload.otp = otp;
                subject = 'Your Verification Code';
                template = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), './src/templates', 'resendOtp.ejs'), email_payload);
                break;
            case workflow_constant_1.EMAIL_SEND_TYPE.REPLY_CONTACTUS_EMAIL:
                email_payload.reply = html;
                template = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), './src/templates', 'contactUs.ejs'), email_payload);
                subject = 'Reply To Your Query';
                break;
            case workflow_constant_1.EMAIL_SEND_TYPE.MAGIC_LINK:
                email_payload.magic_link = magic_link;
                template = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), './src/templates', 'magicLink.ejs'), email_payload);
                subject = 'Verify Your Email';
                break;
            default:
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.invalid_type, null, statusCodes_1.default.API_ERROR);
        }
        const emailSent = transportMethod === 'sendgrid'
            ? yield sendgridMail(to, subject, template)
            : yield nodemail(to, subject, template, attachments);
        console.log(emailSent, "emailSent");
        if (!emailSent.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.email_sent_success, emailSent, statusCodes_1.default.SUCCESS);
    }
    catch (error) {
        return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, error, statusCodes_1.default.API_ERROR);
    }
});
const sendEmailViaSendGrid = (emailType, recipientEmail, body) => sendEmail(emailType, recipientEmail, body, 'sendgrid');
exports.sendEmailViaSendGrid = sendEmailViaSendGrid;
const sendEmailViaNodemail = (emailType, recipientEmail, body, useLocalLogo = true) => sendEmail(emailType, recipientEmail, body, 'nodemailer', useLocalLogo);
exports.sendEmailViaNodemail = sendEmailViaNodemail;
