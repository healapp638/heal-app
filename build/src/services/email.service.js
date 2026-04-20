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
const nodemail = (to_1, subject_1, body_1, ...args_1) => __awaiter(void 0, [to_1, subject_1, body_1, ...args_1], void 0, function* (to, subject, body, attachments = []) {
    const EMAIL_HOST = yield app_constant_1.EMAIL_CREDENTIAL.EMAIL_HOST;
    const SMTP_EMAIL = yield app_constant_1.EMAIL_CREDENTIAL.SMTP_EMAIL;
    const SMTP_API_KEY = yield app_constant_1.EMAIL_CREDENTIAL.SMTP_API_KEY;
    return new Promise((resolve) => {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: EMAIL_HOST,
                port: 465,
                secure: true,
                auth: {
                    user: SMTP_EMAIL,
                    pass: SMTP_API_KEY
                }
            });
            const mailOptions = {
                from: EMAIL_HOST,
                to,
                subject,
                html: body,
                attachments
            };
            transporter.sendMail(mailOptions, (error, data) => {
                if (error) {
                    return resolve((0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, error, statusCodes_1.default.API_ERROR));
                }
                return resolve((0, response_util_1.showResponse)(true, responseMessages_1.default.common.email_sent_success, data, statusCodes_1.default.SUCCESS));
            });
        }
        catch (err) {
            return resolve((0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, err, statusCodes_1.default.API_ERROR));
        }
    });
}); //ends
const sendgridMail = (to_1, subject_1, body_1, ...args_1) => __awaiter(void 0, [to_1, subject_1, body_1, ...args_1], void 0, function* (to, subject, body, attachments = []) {
    const SENDGRID_FROM_EMAIL = yield app_constant_1.EMAIL_CREDENTIAL.SMTP_EMAIL;
    const SENDGRID_API_KEY = yield app_constant_1.EMAIL_CREDENTIAL.SMTP_API_KEY;
    mail_1.default.setApiKey(SENDGRID_API_KEY);
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
const sendEmail = (emailType_1, recipientEmail_1, body_1, transportMethod_1, ...args_1) => __awaiter(void 0, [emailType_1, recipientEmail_1, body_1, transportMethod_1, ...args_1], void 0, function* (emailType, recipientEmail, body, transportMethod, useLocalLogo = false) {
    try {
        const { user_name, otp, html } = body;
        const to = recipientEmail;
        let template = '';
        let subject = '';
        const logoPath = useLocalLogo
            ? path_1.default.join(process.cwd(), './public', 'logo.png')
            : `${app_constant_1.APP.BITBUCKET_URL}/${app_constant_1.APP.PROJECT_LOGO}`;
        const attachments = useLocalLogo ? [{
                filename: 'logo.png',
                path: logoPath,
                cid: 'unique@Logo',
            }] : [];
        const email_payload = {
            project_name: app_constant_1.APP.PROJECT_NAME,
            user_name,
            project_logo: useLocalLogo ? null : logoPath,
            cidLogo: useLocalLogo ? 'unique@Logo' : '',
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
            default:
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.invalid_type, null, statusCodes_1.default.API_ERROR);
        }
        const emailSent = transportMethod === 'sendgrid'
            ? yield sendgridMail(to, subject, template)
            : yield nodemail(to, subject, template, attachments);
        if (!emailSent.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.email_sent_success, emailSent, statusCodes_1.default.SUCCESS);
    }
    catch (error) {
        return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, error, statusCodes_1.default.API_ERROR);
    }
}); //
const sendEmailViaSendGrid = (emailType, recipientEmail, body) => sendEmail(emailType, recipientEmail, body, 'sendgrid');
exports.sendEmailViaSendGrid = sendEmailViaSendGrid;
const sendEmailViaNodemail = (emailType, recipientEmail, body, useLocalLogo = false) => sendEmail(emailType, recipientEmail, body, 'nodemailer', useLocalLogo);
exports.sendEmailViaNodemail = sendEmailViaNodemail;
