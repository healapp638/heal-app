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
const response_util_1 = require("../../utils/response.util");
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const user_daily_challenges_model_1 = __importDefault(require("./user.daily.challenges.model"));
const user_weekly_challenges_model_1 = __importDefault(require("./user.weekly.challenges.model"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const moment_1 = __importDefault(require("moment"));
const UserChallengesHandler = {
    list: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const [dailyChallenges, weeklyChallenges] = yield Promise.all([
            yield user_daily_challenges_model_1.default.find({ user_id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE, createdAt: { $gte: (0, moment_1.default)().startOf('day').toDate(), $lte: (0, moment_1.default)().endOf('day').toDate() } }),
            yield user_weekly_challenges_model_1.default.find({ user_id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE, createdAt: { $gte: (0, moment_1.default)().startOf('week').toDate(), $lte: (0, moment_1.default)().endOf('week').toDate() } })
        ]);
        return (0, response_util_1.showResponse)(true, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.challenges_fetched_successfully, { dailyChallenges, weeklyChallenges }, statusCodes_1.default.SUCCESS);
    }),
    completeChallenges: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(userId, "userId");
        return (0, response_util_1.showResponse)(true, "Challenges completed successfully", {}, statusCodes_1.default.SUCCESS);
    })
};
exports.default = UserChallengesHandler;
