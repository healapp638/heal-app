import { Worker } from "bullmq";
import IORedis from "ioredis";
import xlsx from "xlsx";
import { languages, USER_STATUS } from "../constants/workflow.constant";
import { translatePlainText } from "./langauge.translate.helper";
import adminThemeModel from "../modules/AdminTheme/admin.theme.model";
import adminModulesModel from "../modules/AdminModules/admin.modules.model";
import adminSubmodulesModel from "../modules/AdminSubModules/admin.submodules.model";
import adminPhasesModel from "../modules/AdminPhases/admin.phases.model";
import { connection as connectDB } from "../configs/mongoose.config";
import { initializeAwsCredential, REDIS_CREDENTIAL } from "../constants/app.constant";
import adminExelModel from "../modules/AdminCommon/admin.exel.model";
import { sendTopicNotification } from "../services/notification.service";
import adminAuthModel from "../modules/AdminAuth/admin.auth.model";
import userAffirmationModel from "../modules/UserAffirmation/user.affirmation.model";
import adminMcqexerciseModel from "../modules/AdminExercise/admin.mcqexercise.model";
console.log("👷 Worker booting...");


// ✅ Redis connection
const redisConnection = new IORedis({
    host: REDIS_CREDENTIAL.REDIS_HOST || 'redis',
    port: REDIS_CREDENTIAL.PORT || 6379,
    maxRetriesPerRequest: null,
});


// ✅ Safe DB upsert
const safeUpsert = async (model: any, query: any, insertData: any) => {
    try {
        return await model.findOneAndUpdate(
            query,
            { $set: { status: USER_STATUS.ACTIVE }, $setOnInsert: insertData },
            { upsert: true, new: true }
        );
    } catch (err: any) {
        console.error("❌ safeUpsert failed:", {
            query,
            error: err.message,
        });
        throw err;
    }
};

// ✅ Translation (NO lowercase)
const getTranslatedObj = async (text: string) => {
    if (!text) return {};

    const langs = Object.values(languages) as string[];
    const obj: any = {};

    await Promise.all(
        langs.map(async (lang) => {
            obj[lang] = await translatePlainText(text, lang);
        })
    );

    return obj; // ✅ keep original casing
};

// ✅ Update import status
const updateImportStatus = async (themeTitle: string, status: number) => {
    try {
        await adminExelModel.findOneAndUpdate(
            { excelTheme: themeTitle },
            {
                excelTheme: themeTitle,
                status: status
            },
            { upsert: true, new: true }
        );
        console.log(`📊 Import status updated to ${status} for theme: ${themeTitle}`);
    } catch (err) {
        console.error(`❌ Failed to update status:`, err);
    }
};

// 🚀 START WORKER
const startWorker = async () => {
    console.log("🔌 Connecting DB...");
    await initializeAwsCredential();
    await connectDB();
    console.log("✅ DB connected");

    const worker = new Worker(
        "excel-import",
        async (job) => {
            // let themeTitle = "unknown"; // Initialize with default value
            // console.log(`🚀 Processing Job ${job.id}`);

            try {
                // ✅ Fix buffer
                const rawBuffer = job.data.fileBuffer;
                const fileBuffer = Buffer.isBuffer(rawBuffer)
                    ? rawBuffer
                    : Buffer.from(rawBuffer.data);

                const workbook = xlsx.read(fileBuffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];

                const sheetData: any[] = xlsx.utils.sheet_to_json(
                    workbook.Sheets[sheetName],
                    { defval: "" }
                );

                // console.log("📊 Rows:", sheetData.length);

                if (!sheetData.length) {
                    // console.log("❌ Empty Excel");
                    return;
                }

                // Get theme title from first row (it will remain same throughout)
                const themeTitle = sheetData[0]?.theme_title?.trim();
                if (!themeTitle) {
                    console.error("❌ No theme title found in Excel");
                    return;
                }

                // Status 1: Start/Pending
                await updateImportStatus(themeTitle, 1);

                // Status 2: In Progress
                await updateImportStatus(themeTitle, 2);

                // let rowCount = 1;

                for (const row of sheetData) {
                    try {

                        // ================= THEME =================
                        if (!row.theme_title) continue;

                        const theme = await safeUpsert(
                            adminThemeModel,
                            { "title.en": row.theme_title.trim() },
                            {
                                title: await getTranslatedObj(row.theme_title),
                                description: await getTranslatedObj(row.theme_description),
                                imgUrl: row.theme_imgUrl || "",
                            }
                        );

                        // ================= MODULE =================
                        const module = await safeUpsert(
                            adminModulesModel,
                            {
                                themeId: theme._id,
                                "title.en": row.module_title.trim(),
                            },
                            {
                                themeId: theme._id,
                                title: await getTranslatedObj(row.module_title),
                            }
                        );

                        // ================= SUBMODULE =================
                        const subModule = await safeUpsert(
                            adminSubmodulesModel,
                            {
                                moduleId: module._id,
                                "title.en": row.submodule_title.trim(),
                            },
                            {
                                moduleId: module._id,
                                title: await getTranslatedObj(row.submodule_title),
                                description: await getTranslatedObj(row.submodule_description),
                            }
                        );

                        // ================= PHASE =================
                        const phase = await safeUpsert(
                            adminPhasesModel,
                            {
                                subModuleId: subModule._id,
                                "title.en": row.phase_title.trim(),
                            },
                            {
                                subModuleId: subModule._id,
                                title: await getTranslatedObj(row.phase_title),
                                reflection: await getTranslatedObj(row.personal_reflection),
                                points: row.phase_points || 0,
                            }
                        );


                        // ======================================================
                        // STEP 1
                        // NORMAL CONTENT TYPE
                        // ======================================================

                        const step1Title = row["exercise_title_step1"];
                        const step1Description = row["exercise_description_step1"];

                        // create even if mcq empty
                        if (step1Title) {

                            await safeUpsert(
                                adminMcqexerciseModel,
                                {
                                    phase_id: phase._id,
                                    "title.en": step1Title.trim(),
                                },
                                {
                                    phase_id: phase._id,
                                    title: await getTranslatedObj(step1Title),
                                    // optional
                                    description: await getTranslatedObj(step1Description || ""),
                                    // empty
                                    mcq: [],
                                }
                            );
                        }
                        // ======================================================
                        // STEP 2+
                        // MCQ TYPE
                        // ======================================================

                        for (let step = 2; step <= 20; step++) {

                            const exerciseTitle = row[`exercise_title_step${step}`];

                            // skip if no title
                            if (!exerciseTitle) continue;

                            // ======================================================
                            // OPTIONS
                            // ======================================================

                            const mcqOptions: any[] = [];

                            for (let i = 1; i <= 10; i++) {

                                const optionText = row[`mcq${i}_step${step}`];

                                if (!optionText) continue;

                                mcqOptions.push({
                                    option: await getTranslatedObj(optionText.toString().trim()),
                                });
                            }

                            // ======================================================
                            // CREATE MCQ
                            // ======================================================

                            await safeUpsert(adminMcqexerciseModel,
                                {
                                    phase_id: phase._id,
                                    "title.en": exerciseTitle.trim(),
                                },
                                {
                                    phase_id: phase._id,
                                    title: await getTranslatedObj(exerciseTitle),
                                    description: await getTranslatedObj(""),
                                    mcq: mcqOptions,
                                }
                            );

                        }

                        await initializeAwsCredential();
                    } catch (rowErr) {
                        console.error("❌ Row failed, skipping:", rowErr);
                        continue;
                    }
                }
                await updateImportStatus(themeTitle, 3);
                const admindata = await adminAuthModel.findOne({ user_type: 1 }).lean();
                const admin_id = admindata?._id
                const title = "Excel Import Completed Successfully";
                const message = "Excel has been successfully imported"
                await sendTopicNotification(
                    `${admin_id}`,
                    title,
                    message,
                    {},
                );

            } catch (err) {
                console.error("❌ Job error:", err);
                const themeTitle = job.data.fileBuffer ? "unknown" : "unknown";
                await updateImportStatus(themeTitle, 0);
                // throw err;

            }
        },
        {
            connection: redisConnection,
            concurrency: 1,
        }
    );

    worker.on("completed", (job) => {
        console.log(` Job ${job.id} done`);
    });

    worker.on("failed", (job, err) => {
        console.error(`❌ Job ${job?.id} failed`, err);
    });
};

// 🚀 Start
startWorker();


// ================= AFFIRMATION WORKER =================


const startAffirmationWorker = async () => {

    console.log("🔌 Connecting DB...");
    await initializeAwsCredential();
    await connectDB();

    console.log("✅ DB connected");

    const worker = new Worker(
        "affirmation-import",
        async (job) => {


            try {

                // ================= BUFFER =================
                const rawBuffer = job.data.fileBuffer;

                const fileBuffer = Buffer.isBuffer(rawBuffer)
                    ? rawBuffer
                    : Buffer.from(rawBuffer.data);

                // ================= READ EXCEL =================
                const workbook = xlsx.read(fileBuffer, {
                    type: "buffer",
                });

                const sheetName = workbook.SheetNames[0];

                const sheetData: any[] =
                    xlsx.utils.sheet_to_json(
                        workbook.Sheets[sheetName],
                        { defval: "" }
                    );


                if (!sheetData.length) {

                    return;
                }

                // let rowCount = 1;

                // ================= LOOP ROWS =================
                for (const row of sheetData) {

                    try {



                        const affirmation =
                            row?.affirmation?.toString()?.trim();

                        if (!affirmation) {

                            continue;
                        }


                        // ================= TRANSLATION =================
                        const translatedAffirmation =
                            await getTranslatedObj(
                                affirmation
                            );


                        // ================= CHECK DUPLICATE =================

                        const existingAffirmation =
                            await userAffirmationModel.findOne({

                                "affirmation.en": {
                                    $regex: `^${affirmation}$`,
                                    $options: "i",
                                },

                                status: {
                                    $ne: USER_STATUS.DELETED,
                                },
                            });

                        if (existingAffirmation) {

                            continue;
                        }

                        // ================= SAVE =================

                            await userAffirmationModel.create({

                                affirmation:
                                    translatedAffirmation,

                                type: "Admin",

                                user_id: [],
                            });


                    } catch (rowError) {

                        console.error(
                            "❌ Row failed:",
                            rowError
                        );

                        continue;
                    }
                }

            } catch (error) {

                console.error(
                    "❌ Worker Job Error:",
                    error
                );

                throw error;
            }
        },
        {
            connection: redisConnection,
            concurrency: 5,
        }
    );

    // ================= EVENTS =================
    worker.on("completed", (job) => {
        console.log(
            ` Job ${job.id} completed successfully`
        );
    });

    worker.on("failed", (job, err) => {

        console.error(
            `❌ Job ${job?.id} failed`,
            err
        );
    });
};

// ================= START =================
startAffirmationWorker();