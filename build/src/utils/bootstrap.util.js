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
exports.bootstrapAdmin = void 0;
const db_helpers_1 = require("../helpers/db.helpers");
const admin_auth_model_1 = __importDefault(require("../modules/AdminAuth/admin.auth.model"));
const commonContent_model_1 = __importDefault(require("../modules/AdminCommon/commonContent.model"));
const commonHelper = __importStar(require("../helpers/common.helper"));
const app_constant_1 = require("../constants/app.constant");
const bootstrapAdmin = function (cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const userPassword = yield commonHelper.bycrptPasswordHash("123456");
        const adminData = {
            password: userPassword,
            email: `${app_constant_1.APP.ADMIN_CRED_EMAIL}`,
            first_name: 'Admin',
            last_name: 'Account',
        };
        const commonContentData = {
            about: "<p> About us </p>",
            privacy_policy: "<p> Privacy Policy </p>",
            terms_conditions: "<p> Default Terms </p>",
        };
        const adminDoc = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, {});
        if (!adminDoc.status) {
            const adminRef = new admin_auth_model_1.default(adminData);
            yield (0, db_helpers_1.createOne)(adminRef);
        }
        const commonContent = yield (0, db_helpers_1.findOne)(commonContent_model_1.default, {});
        if (!commonContent.status) {
            const commonContentRef = new commonContent_model_1.default(commonContentData);
            yield (0, db_helpers_1.createOne)(commonContentRef);
        }
        // Use It If Project Requirement is Image Search 
        //finds all aws RekognitionCollection   
        // let collectionList = await services.awsService.awsFaceRekognitionFunctions.listCollectionAwsRekognition()
        // const collectionId = AWS_CREDENTIAL.COLLECTION_ID_AWS_REKOGNITION
        // //if collection list function works
        // if (collectionList.status) {
        //   let existCollectionId = collectionList.data.filter((collection_id: any) => collection_id == collectionId)
        //   //if collection id not create till then create a new one 
        //   if (existCollectionId.length == 0) {
        //     let response = await services.awsService.awsFaceRekognitionFunctions.createCollectionAwsRekognition(collectionId)
        //     if (response.status) {
        //     }
        //   }
        // } //ends
        cb();
    });
};
exports.bootstrapAdmin = bootstrapAdmin;
