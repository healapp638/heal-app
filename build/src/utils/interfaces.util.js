"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenUserTypeInterface = exports.EmailSendType = void 0;
// Define an enum for the email send types
var EmailSendType;
(function (EmailSendType) {
    EmailSendType["REGISTER_EMAIL"] = "register";
    EmailSendType["FORGOT_PASSWORD_EMAIL"] = "forgot_password";
    EmailSendType["SEND_OTP_EMAIL"] = "resend_otp";
    EmailSendType["REPLY_CONTACTUS_EMAIL"] = "reply_contactus";
})(EmailSendType || (exports.EmailSendType = EmailSendType = {}));
var tokenUserTypeInterface;
(function (tokenUserTypeInterface) {
    tokenUserTypeInterface["USER"] = "user";
    tokenUserTypeInterface["ADMIN"] = "admin";
})(tokenUserTypeInterface || (exports.tokenUserTypeInterface = tokenUserTypeInterface = {}));
