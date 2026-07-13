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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = exports.validationError = void 0;
const validationError = (res, error) => __awaiter(void 0, void 0, void 0, function* () {
    const code = 417; //expectation failed
    const validationErrors = error.message.replace(new RegExp('\\"', "g"), "");
    // const validationErrors = error.details.map((error) => error.message.replace(new RegExp('\\"', "g"), ""));
    return res.status(code).json({
        status: false,
        statusCode: code,
        validationFailed: true,
        message: validationErrors,
    });
});
exports.validationError = validationError;
const validator = (schema) => {
    return function (req, res, next) {
        try {
            if (schema.body) {
                const { error, value } = schema.body.validate(req.body);
                if (error)
                    throw error;
                req.body = value;
                next();
            }
            else if (schema.query) {
                const { error, value } = schema.query.validate(req.query);
                if (error)
                    throw error;
                req.query = value;
                next();
            }
            else {
                const { error, value } = schema.params.validate(req.params);
                if (error)
                    throw error;
                req.params = value;
                next();
            }
        }
        catch (error) {
            return (0, exports.validationError)(res, error);
        }
    };
};
exports.validator = validator;
exports.default = { validator: exports.validator };
