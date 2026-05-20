
export const ROUTES = {
    WELCOME:{
        WELCOME:`/`
    },
    // Auth group
    AUTH:{
        REGISTER: "/register",
        VERIFY_OTP: "/otp-verify",
        FORGOT_PASSWORD: "/forgot-password",
        RESET_PASSWORD: "/reset-password",
    },

    // Protected group
    PRIVATE:{
        HOME: "/home",
        TERMSANDCONDITION: "/termsandcondition",
        PRIVACYPOLICY: "/privacypolicy",
        CONTACTUS:"/contactus",
        MODULE:"/module",
        ADDMODULE:"/module/addModule",
        SUBMODULE:"/module/subModule",
        ADDPHASES:"/module/addPhase",
        ADDLESSONS:"/module/addLessons",
        FAQ:"/faq",
        ABOUTUS:"/aboutus",
        ADDEXERCISE:"/module/addExercise",
        PROFILE:"/profile",
        USERS:"/users",
        USERDETAIL:"/users/userDetail",
        ADDEXCEL:"/addexcel",
        AFFIRMATION:"/affirmation",
        CATEGORY:"/category",
        HOMETHEME:"/category/theme",
        ADDMCQEXERCISE:"/module/addMcqExercise",
        
    },

    // Common public pages
    COMMON:{
        DELETE_ACCOUNT: "/delete-account",
        TERMS: "/terms",
        PRIVACY: "/privacy",
        CONTACT: "/contact",
    },

} as const