import { Schema, model } from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';

const UserSchema = new Schema(
    {
        hearAboutUs: { type: String, default: "" },
        bringsYouHere: { type: String, default: "" },
        howFellingLately: { type: String, default: "" },
        likeToFellMore: { type: String, default: "" },
        timeYouCommit: { type: String, default: "" },
        startShowingOfYourSelf: { type: String, default: "" },
        fullName: { type: String, default: "" },
        country: { type: String, default: "" },
        email: { type: String, default: "", index: true },
        dob: { type: Date, default: "" },
        password: { type: String, default: "" },
        otp: { type: Number, default: null },
        otpCreatedAt: { type: Date, default: null },
        profilePic: { type: String, default: "" },
        isVerified: { type: Boolean, default: false },
        deactivateBy: { type: String },
        reason: { type: String },
        status: { type: Number, default: USER_STATUS.ACTIVE },
        language: { type: String, default: "en" },

        //******Use When Social Login Used******/
        social_account: [{
            source: {
                type: String,
                default: null
            },
            email: {
                type: String,
                default: null
            },
            token: {
                type: String,
                default: null
            },
            name: {
                type: String,
                default: null
            }

        }],
        account_source: {
            type: String,
            default: 'email',
            Comment: "email for normal created google with google apple with apple "
        },

    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
        versionKey: false,
        timestamps: true
    },

)

export default model('user', UserSchema)