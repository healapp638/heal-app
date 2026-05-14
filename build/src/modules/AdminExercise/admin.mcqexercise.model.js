"use strict";
// import mongoose from 'mongoose';
// import { USER_STATUS } from '../../constants/workflow.constant';
// const langSchema = {
//     en: { type: String, default: '' },
//     zh: { type: String, default: '' },
//     hi: { type: String, default: '' },
//     es: { type: String, default: '' },
//     fr: { type: String, default: '' },
//     de: { type: String, default: '' },
//     ru: { type: String, default: '' },
//     pt: { type: String, default: '' },
//     it: { type: String, default: '' },
//     ro: { type: String, default: '' },
// };
// const mcqSchema = new mongoose.Schema({
//     options: {
//         type: [langSchema],
//         default: [],
//     },
// });
// const mcqexerciseSchema = new mongoose.Schema(
//     {
//         title: langSchema,
//         description: langSchema,
//         exercise_details_id: { type: mongoose.Schema.Types.ObjectId, ref: 'mcqExerciseDetails', default: null },
//         mcq: [mcqSchema],
//         status: { type: Number, default: USER_STATUS.ACTIVE },
//     },
//     { timestamps: true, versionKey: false }
// );
// export default mongoose.model('mcqExercise', mcqexerciseSchema);
