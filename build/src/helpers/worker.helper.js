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
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const xlsx_1 = __importDefault(require("xlsx"));
const workflow_constant_1 = require("../constants/workflow.constant");
const langauge_translate_helper_1 = require("./langauge.translate.helper");
const admin_theme_model_1 = __importDefault(require("../modules/AdminTheme/admin.theme.model"));
const admin_modules_model_1 = __importDefault(require("../modules/AdminModules/admin.modules.model"));
const admin_submodules_model_1 = __importDefault(require("../modules/AdminSubModules/admin.submodules.model"));
const admin_phases_model_1 = __importDefault(require("../modules/AdminPhases/admin.phases.model"));
const mongoose_config_1 = require("../configs/mongoose.config");
const app_constant_1 = require("../constants/app.constant");
const admin_exel_model_1 = __importDefault(require("../modules/AdminCommon/admin.exel.model"));
const notification_service_1 = require("../services/notification.service");
const admin_auth_model_1 = __importDefault(require("../modules/AdminAuth/admin.auth.model"));
const user_affirmation_model_1 = __importDefault(require("../modules/UserAffirmation/user.affirmation.model"));
const admin_mcqexercise_model_1 = __importDefault(require("../modules/AdminExercise/admin.mcqexercise.model"));
console.log("👷 Worker booting...");
// ✅ Redis connection
const redisConnection = new ioredis_1.default({
    host: app_constant_1.REDIS_CREDENTIAL.REDIS_HOST || 'redis',
    port: app_constant_1.REDIS_CREDENTIAL.PORT || 6379,
    maxRetriesPerRequest: null,
});
// ✅ Safe DB upsert
const safeUpsert = (model, query, insertData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield model.findOneAndUpdate(query, { $set: { status: workflow_constant_1.USER_STATUS.ACTIVE }, $setOnInsert: insertData }, { upsert: true, new: true });
    }
    catch (err) {
        console.error("❌ safeUpsert failed:", {
            query,
            error: err.message,
        });
        throw err;
    }
});
// ✅ Translation (NO lowercase)
const getTranslatedObj = (text) => __awaiter(void 0, void 0, void 0, function* () {
    if (!text)
        return {};
    const langs = Object.values(workflow_constant_1.languages);
    const obj = {};
    yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
        obj[lang] = yield (0, langauge_translate_helper_1.translatePlainText)(text, lang);
    })));
    return obj; // ✅ keep original casing
});
// ✅ Update import status
const updateImportStatus = (themeTitle, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield admin_exel_model_1.default.findOneAndUpdate({ excelTheme: themeTitle }, {
            excelTheme: themeTitle,
            status: status
        }, { upsert: true, new: true });
        // console.log(`📊 Import status updated to ${status} for theme: ${themeTitle}`);
    }
    catch (err) {
        console.error(`❌ Failed to update status:`, err);
    }
});
// 🚀 START WORKER
const startWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("🔌 Connecting DB...");
    yield (0, app_constant_1.initializeAwsCredential)();
    yield (0, mongoose_config_1.connection)();
    console.log("✅ DB connected");
    const worker = new bullmq_1.Worker("excel-import", (job) => __awaiter(void 0, void 0, void 0, function* () {
        // let themeTitle = "unknown"; // Initialize with default value
        // console.log(`🚀 Processing Job ${job.id}`);
        var _a, _b;
        try {
            // ✅ Fix buffer
            const rawBuffer = job.data.fileBuffer;
            const fileBuffer = Buffer.isBuffer(rawBuffer)
                ? rawBuffer
                : Buffer.from(rawBuffer.data);
            const workbook = xlsx_1.default.read(fileBuffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
            // console.log("📊 Rows:", sheetData.length);
            if (!sheetData.length) {
                // console.log("❌ Empty Excel");
                return;
            }
            // Get theme title from first row (it will remain same throughout)
            const themeTitle = (_b = (_a = sheetData[0]) === null || _a === void 0 ? void 0 : _a.theme_title) === null || _b === void 0 ? void 0 : _b.trim();
            if (!themeTitle) {
                console.error("❌ No theme title found in Excel");
                return;
            }
            // Status 1: Start/Pending
            yield updateImportStatus(themeTitle, 1);
            // Status 2: In Progress
            yield updateImportStatus(themeTitle, 2);
            // let rowCount = 1;
            for (const row of sheetData) {
                try {
                    // ================= THEME =================
                    if (!row.theme_title)
                        continue;
                    const theme = yield safeUpsert(admin_theme_model_1.default, { "title.en": row.theme_title.trim() }, {
                        title: yield getTranslatedObj(row.theme_title),
                        description: yield getTranslatedObj(row.theme_description),
                        imgUrl: row.theme_imgUrl || "",
                    });
                    // ================= MODULE =================
                    const module = yield safeUpsert(admin_modules_model_1.default, {
                        themeId: theme._id,
                        "title.en": row.module_title.trim(),
                    }, {
                        themeId: theme._id,
                        title: yield getTranslatedObj(row.module_title),
                    });
                    // ================= SUBMODULE =================
                    const subModule = yield safeUpsert(admin_submodules_model_1.default, {
                        moduleId: module._id,
                        "title.en": row.submodule_title.trim(),
                    }, {
                        moduleId: module._id,
                        title: yield getTranslatedObj(row.submodule_title),
                        description: yield getTranslatedObj(row.submodule_description),
                    });
                    // ================= PHASE =================
                    const phase = yield safeUpsert(admin_phases_model_1.default, {
                        subModuleId: subModule._id,
                        "title.en": row.phase_title.trim(),
                    }, {
                        subModuleId: subModule._id,
                        title: yield getTranslatedObj(row.phase_title),
                        reflection: yield getTranslatedObj(row.personal_reflection),
                        points: row.phase_points || 0,
                    });
                    // ======================================================
                    // STEP 1
                    // NORMAL CONTENT TYPE
                    // ======================================================
                    const step1Title = row["exercise_title_step1"];
                    const step1Description = row["exercise_description_step1"];
                    // create even if mcq empty
                    if (step1Title) {
                        yield safeUpsert(admin_mcqexercise_model_1.default, {
                            phase_id: phase._id,
                            "title.en": step1Title.trim(),
                        }, {
                            phase_id: phase._id,
                            title: yield getTranslatedObj(step1Title),
                            // optional
                            description: yield getTranslatedObj(step1Description || ""),
                            // empty
                            mcq: [],
                        });
                    }
                    // ======================================================
                    // STEP 2+
                    // MCQ TYPE
                    // ======================================================
                    for (let step = 2; step <= 20; step++) {
                        const exerciseTitle = row[`exercise_title_step${step}`];
                        // skip if no title
                        if (!exerciseTitle)
                            continue;
                        // ======================================================
                        // OPTIONS
                        // ======================================================
                        const mcqOptions = [];
                        for (let i = 1; i <= 10; i++) {
                            const optionText = row[`mcq${i}_step${step}`];
                            if (!optionText)
                                continue;
                            mcqOptions.push({
                                option: yield getTranslatedObj(optionText.toString().trim()),
                            });
                        }
                        // ======================================================
                        // CREATE MCQ
                        // ======================================================
                        yield safeUpsert(admin_mcqexercise_model_1.default, {
                            phase_id: phase._id,
                            "title.en": exerciseTitle.trim(),
                        }, {
                            phase_id: phase._id,
                            title: yield getTranslatedObj(exerciseTitle),
                            description: yield getTranslatedObj(""),
                            mcq: mcqOptions,
                        });
                    }
                    yield (0, app_constant_1.initializeAwsCredential)();
                }
                catch (rowErr) {
                    console.error("❌ Row failed, skipping:", rowErr);
                    continue;
                }
            }
            yield updateImportStatus(themeTitle, 3);
            const admindata = yield admin_auth_model_1.default.findOne({ user_type: 1 }).lean();
            const admin_id = admindata === null || admindata === void 0 ? void 0 : admindata._id;
            const title = "Excel Import Completed Successfully";
            const message = "Excel has been successfully imported";
            yield (0, notification_service_1.sendTopicNotification)(`${admin_id}`, title, message, {});
        }
        catch (err) {
            console.error("❌ Job error:", err);
            const themeTitle = job.data.fileBuffer ? "unknown" : "unknown";
            yield updateImportStatus(themeTitle, 0);
            // throw err;
        }
    }), {
        connection: redisConnection,
        concurrency: 1,
    });
    worker.on("completed", (job) => {
        console.log(` Job ${job.id} done`);
    });
    // worker.on("failed", (job, err) => {
    //     console.error(`❌ Job ${job?.id} failed`, err);
    // });
});
// 🚀 Start
startWorker();
// ================= AFFIRMATION WORKER =================
const startAffirmationWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("🔌 Connecting DB...");
    yield (0, app_constant_1.initializeAwsCredential)();
    yield (0, mongoose_config_1.connection)();
    console.log("✅ DB connected");
    const worker = new bullmq_1.Worker("affirmation-import", (job) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            // ================= BUFFER =================
            const rawBuffer = job.data.fileBuffer;
            const fileBuffer = Buffer.isBuffer(rawBuffer)
                ? rawBuffer
                : Buffer.from(rawBuffer.data);
            // ================= READ EXCEL =================
            const workbook = xlsx_1.default.read(fileBuffer, {
                type: "buffer",
            });
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
            if (!sheetData.length) {
                return;
            }
            // let rowCount = 1;
            // ================= LOOP ROWS =================
            for (const row of sheetData) {
                try {
                    const affirmation = (_b = (_a = row === null || row === void 0 ? void 0 : row.affirmation) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!affirmation) {
                        continue;
                    }
                    // ================= TRANSLATION =================
                    const translatedAffirmation = yield getTranslatedObj(affirmation);
                    // ================= CHECK DUPLICATE =================
                    const existingAffirmation = yield user_affirmation_model_1.default.findOne({
                        "affirmation.en": {
                            $regex: `^${affirmation}$`,
                            $options: "i",
                        },
                        status: {
                            $ne: workflow_constant_1.USER_STATUS.DELETED,
                        },
                    });
                    if (existingAffirmation) {
                        continue;
                    }
                    // ================= SAVE =================
                    yield user_affirmation_model_1.default.create({
                        affirmation: translatedAffirmation,
                        type: "Admin",
                        user_id: [],
                    });
                }
                catch (rowError) {
                    console.error("❌ Row failed:", rowError);
                    continue;
                }
            }
        }
        catch (error) {
            console.error("❌ Worker Job Error:", error);
            throw error;
        }
    }), {
        connection: redisConnection,
        concurrency: 5,
    });
    // ================= EVENTS =================
    worker.on("completed", (job) => {
        console.log(` Job ${job.id} completed successfully`);
    });
    // worker.on("failed", (job, err) => {
    //     console.error(
    //         `❌ Job ${job?.id} failed`,
    //         err
    //     );
    // });
});
// ================= START =================
startAffirmationWorker();
