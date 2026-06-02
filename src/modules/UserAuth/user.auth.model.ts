import { Schema, model } from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';
const UserSchema = new Schema(
    {
        hearAboutUs: { type: String, default: "" },
        howFellingLately: { type: String, default: "" },
        bringsYouHere: { type: String, default: "" },
        startShowingOfYourSelf:{ type: String, default: "" },
        feelThatWay: { type: String, default: "" },
        likeToFellMore: { type: String, default: "" },
        helpFeelBetter: { type: String, default: "" },
        stopFeelBetter: { type: String, default: "" },
        timeYouCommit: { type: String, default: "" },
        goalStartWith: { type: String, default: "" },
        fullName: { type: String, default: "" },
        // country: { type: String, default: "" },
        email: { type: String, default: "", index: true },
        // dob: { type: Date, default: "" },
        // password: { type: String, default: "" },
        // otp: { type: String, default: null },
        // otpCreatedAt: { type: Date, default: null },
        profilePic: { type: String, default: "file/file-1777357630130.webp" },
        isVerified: { type: Boolean, default: true },
        deactivateBy: { type: String },
        reason: { type: String },
        status: { type: Number, default: USER_STATUS.ACTIVE },
        language: { type: String, default: "en" },
        trial_package_use:{type:Boolean,default:false},
        on_trial_period:{type:Boolean,default:false},
        trial_expire_time:{type:String,default:""},
        // first_name: { type: String, default: "" },


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
        // is_biometric: { type: Boolean, default: false },
        timeZone: { type: String, default: "" },
        is_onboarding :{ type: Boolean, default: false },
        lastDailyChallengeGeneratedDate: { type: Date, default: null },
        lastWeeklyChallengeGeneratedDate: { type: Date, default: null },
        isDailyChallengeInProgress: { type: Boolean, default: false },
        isWeeklyChallengeInProgress: { type: Boolean, default: false },
        streak_count: { type: Number, default: 0 },
        streak_credit: { type: Number, default: 0 },
        streak_days:{ type: [Number], default: [] },
        last_streak_date: { type: String, default: "" }, // YYYY-MM-DD in user timezone
        extra_credits:{ type: Number, default: 0 }
        
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