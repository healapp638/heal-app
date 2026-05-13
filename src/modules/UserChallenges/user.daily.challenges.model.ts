import mongoose from "mongoose";
import { USER_STATUS } from "../../constants/workflow.constant";
import moment from "moment";

const langSchema = {
    en: { type: String, default: '' },
    zh: { type: String, default: '' },
    hi: { type: String, default: '' },
    es: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
    ru: { type: String, default: '' },
    pt: { type: String, default: '' },
    it: { type: String, default: '' },
    ro: { type: String, default: '' },
};

const daily_challenges = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth',
    },
    title: {
        type: langSchema
    },
    description: {
        type: langSchema,
    },
    status: {
        type: Number,
        default: USER_STATUS.ACTIVE
    },
    points: {
        type: Number,
        default: 0
    },
    concept_title: {
        type: langSchema
    },
    concept_description: {
        type: langSchema
    },
    about_challenge: {
        type: langSchema
    },
    exercises: [
        {
            title: { type: langSchema },
            step_number: { type: Number }
        }
    ],
    challenge_type: {
        type: String,
        enum: ['daily', 'weekly']
    },
    //after 24 hour from now
    end_date_unix: {
        type: Number,
        default: () => {
            const endOfDay = moment().endOf('day').unix();
            return endOfDay;
        }
    },
    isCompleted: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });

const userDailyChallengesModel = mongoose.model('daily_challenges', daily_challenges, 'daily_challenges');

export default userDailyChallengesModel;