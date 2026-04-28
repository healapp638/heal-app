export const ENDPOINTS = {
    // AUTH
    AUTH:{
        LOGIN: "admin/auth/login",
        REGISTER: "admin/auth/register",
        FORGOT_PASSWORD: "admin/auth/forgot_password",
        RESET_PASSWORD: "admin/auth/reset_password",
        CHANGE_PASSWORD: "admin/auth/change-password",
        OTP: "admin/auth/otp",
        SEND_OTP: "admin/auth/resend_otp",
        VERIFY_OTP: "admin/auth/verify_otp",
    },
    COMMON:{
        UPLOAD_FILE: "user/auth/upload_file",
        COMMON_CONTENT:"common/common_content"
    },
    // PRIVATE
    PRIVATE:{
        CREATE_THEME: "admin/theme/create_theme",
        LIST_THEME:"admin/theme/list_theme",
        DELETE_THEME:"admin/theme/delete_theme",
        CREATE_MODULE: "admin/modules/create_module",
        LIST_MODULE:"admin/modules/list_module",
        UPDATE_COMMON_CONTENT:"admin/common/common_content",
        RESET_COMMON_CONTENT:"admin/common/reset_common_content",
        
    }
}