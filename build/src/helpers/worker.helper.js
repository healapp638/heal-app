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
const admin_exercise_details__model_1 = __importDefault(require("../modules/AdminExercise/admin.exercise.details..model"));
const admin_excercise_model_1 = __importDefault(require("../modules/AdminExercise/admin.excercise.model"));
const mongoose_config_1 = require("../configs/mongoose.config");
const admin_exel_model_1 = __importDefault(require("../modules/AdminCommon/admin.exel.model"));
const notification_service_1 = require("../services/notification.service");
const admin_auth_model_1 = __importDefault(require("../modules/AdminAuth/admin.auth.model"));
const user_affirmation_model_1 = __importDefault(require("../modules/UserAffirmation/user.affirmation.model"));
console.log("👷 Worker booting...");
// ✅ Redis connection
const redisConnection = new ioredis_1.default({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
});
// ✅ Escape regex (IMPORTANT)
// const escapeRegex = (text: string) =>
//     text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// ✅ Case-insensitive exact match
// const ciMatch = (value: string) => ({
//     $regex: new RegExp(`^${escapeRegex(value.trim())}$`, "i"),
// });
// const normalize = (text: string) =>
//     (text || "")
//         .toString()
//         .trim()
//         .replace(/\s+/g, " ")
//         .toLowerCase();
// ✅ Safe DB upsert
const safeUpsert = (model, query, insertData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield model.findOneAndUpdate(query, { $setOnInsert: insertData }, { upsert: true, new: true });
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
        obj[lang] = yield (0, langauge_translate_helper_1.translateText)(text, lang);
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
        console.log(`📊 Import status updated to ${status} for theme: ${themeTitle}`);
    }
    catch (err) {
        console.error(`❌ Failed to update status:`, err);
    }
});
// 🚀 START WORKER
const startWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔌 Connecting DB...");
    yield (0, mongoose_config_1.connection)();
    console.log("✅ DB connected");
    const worker = new bullmq_1.Worker("excel-import", (job) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        // let themeTitle = "unknown"; // Initialize with default value
        console.log(`🚀 Processing Job ${job.id}`);
        try {
            // ✅ Fix buffer
            const rawBuffer = job.data.fileBuffer;
            const fileBuffer = Buffer.isBuffer(rawBuffer)
                ? rawBuffer
                : Buffer.from(rawBuffer.data);
            const workbook = xlsx_1.default.read(fileBuffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
            console.log("📊 Rows:", sheetData.length);
            if (!sheetData.length) {
                console.log("❌ Empty Excel");
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
            console.log(`✅ Theme "${themeTitle}" import started - Status: 1`);
            // Status 2: In Progress
            yield updateImportStatus(themeTitle, 2);
            console.log(`🔄 Theme "${themeTitle}" import in progress - Status: 2`);
            let rowCount = 1;
            for (const row of sheetData) {
                try {
                    console.log(`\n📦 Row ${rowCount++}`);
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
                        points: row.phase_points || 0,
                    });
                    console.log("📌 Phase:", phase._id);
                    // ================= LESSON =================
                    const exerciseDetail = yield safeUpsert(admin_exercise_details__model_1.default, {
                        phase_id: phase._id,
                        "reading_title.en": row.lesson_reading_title.trim(),
                    }, {
                        phase_id: phase._id,
                        reading_title: yield getTranslatedObj(row.lesson_reading_title.trim()),
                        reading_description: yield getTranslatedObj(row.lesson_reading_description),
                        concept_title: yield getTranslatedObj(row.lesson_concept_title),
                        concept_description: yield getTranslatedObj(row.lesson_concept_description),
                        reflection: yield getTranslatedObj(row.lesson_reflection),
                    });
                    console.log("📘 ExerciseDetail:", exerciseDetail._id);
                    // ================= EXERCISES =================
                    // const exerciseKeys = Object.keys(row).filter((key) =>
                    //   key.startsWith("exercise_description_step")
                    // );
                    // for (const descKey of exerciseKeys) {
                    //   const stepDesc = row[descKey];
                    //   if (!stepDesc) continue;
                    //   const suffix = descKey.replace(
                    //     "exercise_description_step",
                    //     ""
                    //   );
                    //   const stepTitle = row[`exercise_title_step${suffix}`];
                    //   await safeUpsert(
                    //     adminExcerciseModel,
                    //     {
                    //       exercise_details_id: exerciseDetail._id,
                    //       "description.en": ciMatch(stepDesc),
                    //     },
                    //     {
                    //       exercise_details_id: exerciseDetail._id,
                    //       title: await getTranslatedObj(stepTitle),
                    //       description: await getTranslatedObj(stepDesc),
                    //     }
                    //   );
                    // }
                    // ✅ Step map builder (groups by step number)
                    const stepsMap = {};
                    Object.keys(row).forEach((key) => {
                        const value = row[key];
                        if (!value)
                            return;
                        // Match description
                        if (key.startsWith("exercise_description_step")) {
                            const stepNo = key.replace("exercise_description_step", "").trim();
                            if (!stepsMap[stepNo])
                                stepsMap[stepNo] = {};
                            stepsMap[stepNo].desc = value.toString().trim();
                        }
                        // Match title
                        if (key.startsWith("exercise_title_step")) {
                            const stepNo = key.replace("exercise_title_step", "").trim();
                            if (!stepsMap[stepNo])
                                stepsMap[stepNo] = {};
                            stepsMap[stepNo].title = value.toString().trim();
                        }
                    });
                    console.log("🧩 Steps Map:", stepsMap);
                    // ✅ Now process each step
                    for (const stepNo of Object.keys(stepsMap)) {
                        const { title, desc } = stepsMap[stepNo];
                        // ❗ Description is mandatory (your rule)
                        if (!desc) {
                            console.log(`⚠️ Skipping step ${stepNo} (no description)`);
                            continue;
                        }
                        console.log(`📝 Processing Step ${stepNo}`, {
                            title,
                            desc,
                        });
                        try {
                            const exercise = yield safeUpsert(admin_excercise_model_1.default, {
                                exercise_details_id: exerciseDetail._id,
                                "description.en": {
                                    $regex: new RegExp(`^${desc}$`, "i"),
                                },
                            }, {
                                exercise_details_id: exerciseDetail._id,
                                // ✅ if title empty → store empty object
                                title: title
                                    ? yield getTranslatedObj(title)
                                    : {
                                        en: "",
                                        hi: "",
                                        zh: "",
                                        es: "",
                                        fr: "",
                                        de: "",
                                        ru: "",
                                        pt: "",
                                        it: "",
                                        ro: "",
                                    },
                                description: yield getTranslatedObj(desc),
                            });
                            console.log("✅ Exercise saved:", exercise._id);
                        }
                        catch (err) {
                            console.error(`❌ Step ${stepNo} failed`, err);
                        }
                    }
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
            const noti = yield (0, notification_service_1.sendTopicNotification)(`${admin_id}`, title, message, {});
            console.log(noti, "noti");
            console.log(`✅ Job ${job.id} completed`);
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
        console.log(`🎉 Job ${job.id} done`);
    });
    worker.on("failed", (job, err) => {
        console.error(`❌ Job ${job === null || job === void 0 ? void 0 : job.id} failed`, err);
    });
});
// 🚀 Start
startWorker();
// ================= AFFIRMATION WORKER =================
const startAffirmationWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔌 Connecting DB...");
    yield (0, mongoose_config_1.connection)();
    console.log("✅ DB connected");
    const worker = new bullmq_1.Worker("affirmation-import", (job) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        console.log(`🚀 Processing Job ${job.id}`);
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
            console.log("📊 Total Rows:", sheetData.length);
            if (!sheetData.length) {
                console.log("❌ Empty Excel");
                return;
            }
            let rowCount = 1;
            // ================= LOOP ROWS =================
            for (const row of sheetData) {
                try {
                    console.log(`📦 Processing Row ${rowCount++}`);
                    const affirmation = (_b = (_a = row === null || row === void 0 ? void 0 : row.affirmation) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!affirmation) {
                        console.log("⚠️ Empty affirmation skipped");
                        continue;
                    }
                    // ================= TRANSLATION =================
                    const translatedAffirmation = yield getTranslatedObj(affirmation);
                    // ================= SAVE =================
                    // const savedAffirmation =
                    //     await safeUpsert(
                    //         userAffirmationModel,
                    //         {
                    //             "affirmation.en": {
                    //                 $regex: `^${affirmation}$`,
                    //                 $options: "i",
                    //             },
                    //         },
                    //         {
                    //             affirmation:
                    //                 translatedAffirmation,
                    //             type: "Admin",
                    //             user_id: [],
                    //         }
                    //     );
                    // console.log(
                    //     "✅ Saved:",
                    //     savedAffirmation._id
                    // );
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
                        console.log("⚠️ Duplicate affirmation skipped:", affirmation);
                        continue;
                    }
                    // ================= SAVE =================
                    const savedAffirmation = yield user_affirmation_model_1.default.create({
                        affirmation: translatedAffirmation,
                        type: "Admin",
                        user_id: [],
                    });
                    console.log("✅ Saved:", savedAffirmation._id);
                }
                catch (rowError) {
                    console.error("❌ Row failed:", rowError);
                    continue;
                }
            }
            console.log(`🎉 Job ${job.id} completed`);
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
        console.log(`🎉 Job ${job.id} completed successfully`);
    });
    worker.on("failed", (job, err) => {
        console.error(`❌ Job ${job === null || job === void 0 ? void 0 : job.id} failed`, err);
    });
});
// ================= START =================
startAffirmationWorker();
