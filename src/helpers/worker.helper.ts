import { Worker } from "bullmq";
import IORedis from "ioredis";
import xlsx from "xlsx";
import { languages } from "../constants/workflow.constant";
import { translateText } from "./langauge.translate.helper";
import adminThemeModel from "../modules/AdminTheme/admin.theme.model";
import adminModulesModel from "../modules/AdminModules/admin.modules.model";
import adminSubmodulesModel from "../modules/AdminSubModules/admin.submodules.model";
import adminPhasesModel from "../modules/AdminPhases/admin.phases.model";
import adminExerciseDetailsModel from "../modules/AdminExercise/admin.exercise.details..model";
import adminExcerciseModel from "../modules/AdminExercise/admin.excercise.model";

import { connection as connectDB } from "../configs/mongoose.config";
import adminExelModel from "../modules/AdminCommon/admin.exel.model";
import { sendTopicNotification } from "../services/notification.service";
import adminAuthModel from "../modules/AdminAuth/admin.auth.model";

console.log("👷 Worker booting...");

// ✅ Redis connection
const redisConnection = new IORedis({
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
const safeUpsert = async (model: any, query: any, insertData: any) => {
    try {
        return await model.findOneAndUpdate(
            query,
            { $setOnInsert: insertData },
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
            obj[lang] = await translateText(text, lang);
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
    await connectDB();
    console.log("✅ DB connected");

    const worker = new Worker(
        "excel-import",
        async (job) => {
            // let themeTitle = "unknown"; // Initialize with default value
            console.log(`🚀 Processing Job ${job.id}`);

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

                console.log("📊 Rows:", sheetData.length);

                if (!sheetData.length) {
                    console.log("❌ Empty Excel");
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
                console.log(`✅ Theme "${themeTitle}" import started - Status: 1`);

                // Status 2: In Progress
                await updateImportStatus(themeTitle, 2);
                console.log(`🔄 Theme "${themeTitle}" import in progress - Status: 2`);

                let rowCount = 1;

                for (const row of sheetData) {
                    try {
                        console.log(`\n📦 Row ${rowCount++}`);

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
                                points: row.phase_points || 0,
                            }
                        );
                        console.log("📌 Phase:", phase._id);

                        // ================= LESSON =================
                        const exerciseDetail = await safeUpsert(
                            adminExerciseDetailsModel,
                            {
                                phase_id: phase._id,
                                "reading_title.en": row.lesson_reading_title.trim(),
                            },
                            {
                                phase_id: phase._id,
                                reading_title: await getTranslatedObj(row.lesson_reading_title.trim()),
                                reading_description: await getTranslatedObj(
                                    row.lesson_reading_description
                                ),
                                concept_title: await getTranslatedObj(
                                    row.lesson_concept_title
                                ),
                                concept_description: await getTranslatedObj(
                                    row.lesson_concept_description
                                ),
                                reflection: await getTranslatedObj(row.lesson_reflection),
                            }
                        );
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
                        const stepsMap: Record<string, { title?: string; desc?: string }> = {};

                        Object.keys(row).forEach((key) => {
                            const value = row[key];

                            if (!value) return;

                            // Match description
                            if (key.startsWith("exercise_description_step")) {
                                const stepNo = key.replace("exercise_description_step", "").trim();

                                if (!stepsMap[stepNo]) stepsMap[stepNo] = {};
                                stepsMap[stepNo].desc = value.toString().trim();
                            }

                            // Match title
                            if (key.startsWith("exercise_title_step")) {
                                const stepNo = key.replace("exercise_title_step", "").trim();

                                if (!stepsMap[stepNo]) stepsMap[stepNo] = {};
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
                                const exercise = await safeUpsert(
                                    adminExcerciseModel,
                                    {
                                        exercise_details_id: exerciseDetail._id,
                                        "description.en": {
                                            $regex: new RegExp(`^${desc}$`, "i"),
                                        },
                                    },
                                    {
                                        exercise_details_id: exerciseDetail._id,

                                        // ✅ if title empty → store empty object
                                        title: title
                                            ? await getTranslatedObj(title)
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

                                        description: await getTranslatedObj(desc),
                                    }
                                );

                                console.log("✅ Exercise saved:", exercise._id);
                            } catch (err) {
                                console.error(`❌ Step ${stepNo} failed`, err);
                            }
                        }
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
                const noti = await sendTopicNotification(
                    `${admin_id}`,
                    title,
                    message,
                    {},
                );
                console.log(noti,"noti")
                console.log(`✅ Job ${job.id} completed`);
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
        console.log(`🎉 Job ${job.id} done`);
    });

    worker.on("failed", (job, err) => {
        console.error(`❌ Job ${job?.id} failed`, err);
    });
};

// 🚀 Start
startWorker();