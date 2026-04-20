const statusCodes = {
    SUCCESS: 200,               // success with response data 
    CREATED: 201,               // data created 
    BACKGROUND_PROCESS: 202,    //response for background process
    NO_CONTENT: 204,            // success without response data
    API_ERROR: 400,             // bad request 
    AUTH_TOKEN_ERROR: 401,      // Authentication error or Unauthorized
    REFRESH_TOKEN_ERROR: 403,   // Refresh Token Expiry error or forbidden
    NOT_FOUND: 404,             // Data Not Found
    METHOD_NOT_ALLOWED: 405,    // Method Not Allowed
    ACCOUNT_DISABLED: 409,      //  no longer available
    ACCOUNT_DELETED: 410,       //  no longer available
    VALIDATION_ERROR: 417,      // expectation failed
    FILE_UPLOAD_ERROR: 422,     // unprocessible entity
    TOO_MANY_REQUESTS: 429,     // Too Many Request
    SERVER_TRYCATCH_ERROR: 500, // server error 
}

export default statusCodes