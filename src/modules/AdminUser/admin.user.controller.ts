import { Request, Response } from 'express'
import { Route, Controller, Tags, Body, Get, Security, Query, Put, Post } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import { validateUpdateUserStatus, validateGetCustomerDetails, validateDashboard, } from './admin.user.validator';
import handler from '../AdminUser/admin.user.handler'
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes'
import { tryCatchWrapper } from '../../utils/config.util';

//upload interface 

export interface InitMultipartRequest {
    fileName: string;
    fileType: string;
}

export interface SignPartRequest {
    key: string;
    uploadId: string;
    partNumber: number;
}

export interface CompleteMultipartRequest {
    key: string;
    uploadId: string;
    parts: { ETag: string; PartNumber: number }[];
}

@Tags('Admin User Routes')
@Route('/admin/user')

export default class AdminUserController extends Controller {
    req: Request;
    res: Response;
    userId: string
    constructor(req: Request, res: Response) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : ''
    }

    /**
* Get User List
*/
    @Security('Bearer')
    @Get("/list")
    public async getUsersList(@Query() sort_column?: string, @Query() sort_direction?: string, @Query() page?: number, @Query() limit?: number, @Query() search_key?: string, @Query() status?: number): Promise<ApiResponse> {
        const request = { sort_column, sort_direction, page, limit, search_key, status }
        const wrappedFunc = tryCatchWrapper(handler.getUsersList);
        return wrappedFunc(request); // Invoking the wrapped function 

    }
    //ends

    /**
* Get User Details
*/
    @Security('Bearer')
    @Get("/details")
    public async getUserDetails(@Query() user_id: string): Promise<ApiResponse> {

        const validate = validateGetCustomerDetails({ user_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.getUserDetails);
        return wrappedFunc(user_id); // Invoking the wrapped function 
    }
    //ends

    /**
* Update User Status
* 1 for active 2 for delete 3 for deactivate
*/
    @Security('Bearer')
    @Put("/status")
    public async updateUserStatus(@Body() request: { user_id: string, status: number }): Promise<ApiResponse> {

        const validate = validateUpdateUserStatus(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.updateUserStatus);
        return wrappedFunc(request); // Invoking the wrapped function 

    }
    //ends

    /**
* Get Dashboard data
*/
    @Security('Bearer')
    @Get("/dashboard")
    public async getDashboardData(@Query() past_day?: string): Promise<ApiResponse> {

        const validate = validateDashboard({ past_day });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.getDashboardData);
        return wrappedFunc(past_day); // Invoking the wrapped function 

    }
    //ends

    // --- MULTIPART UPLOAD ROUTES START---

    /**
     * 1. Initiate Multipart Upload 
     */
    @Security('Bearer')
    @Post("/upload/multipart/init")
    public async initiateMultipartUpload(@Body() requestBody: InitMultipartRequest): Promise<ApiResponse> {
        // Extract values from the single body object
        const { fileName, fileType } = requestBody;

        const wrappedFunc = tryCatchWrapper(handler.initiateMultipartUpload);
        return wrappedFunc(fileName, fileType);
    }

    /**
     * 2. Sign Part
     */
    @Security('Bearer')
    @Post("/upload/multipart/sign-part")
    public async signMultipartPart(@Body() requestBody: SignPartRequest): Promise<ApiResponse> {
        const { key, uploadId, partNumber } = requestBody;

        const wrappedFunc = tryCatchWrapper(handler.signMultipartPart);
        return wrappedFunc(key, uploadId, partNumber);
    }

    /**
     * 3. Complete Multipart
     */
    @Security('Bearer')
    @Post("/upload/multipart/complete")
    public async completeMultipartUpload(@Body() requestBody: CompleteMultipartRequest): Promise<ApiResponse> {
        const { key, uploadId, parts } = requestBody;

        const wrappedFunc = tryCatchWrapper(handler.completeMultipartUpload);
        return wrappedFunc(key, uploadId, parts);
    }

    /**
     * Process File Admin 
     */
    @Security('Bearer')
    @Post("/upload/process_file_admin")
    public async processFileAdmin(@Body() request: { s3_key: string, duration?: number }): Promise<ApiResponse> {
        if (!request.s3_key) {
            return showResponse(false, "S3 Key is required", null, statusCodes.VALIDATION_ERROR);
        }
        const wrappedFunc = tryCatchWrapper(handler.processFileAdmin);
        return wrappedFunc(request);
    }


    // --- MULTIPART UPLOAD ROUTES END---



    //         /**
    // * Send multiple notifications through a queue. We use background processing—feel free to change it as per your requirements. This is just a sample structure
    // */
    //     @Security('Bearer')
    //     @Post("/send/multiple/notifications")
    //     public async sendMultipleNotifications(): Promise<ApiResponse> {

    //         // const validate = validateSendMultipleNotifications({  });
    //         // if (validate.error) {
    //         //     return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    //         // }
    //         const wrappedFunc = tryCatchWrapper(handler.sendMultipleNotifications);
    //         return wrappedFunc(); // Invoking the wrapped function 

    //     }
    //     //ends


    //         /**
    // * Fetch the user list using the cache to improve performance. This is a sample structure; you can change it as per your requirements
    // */
    //     @Security('Bearer')
    //     @Get("/list/through_cache")
    //     public async getUsersListThroughCache(@Query() sort_column?: string, @Query() sort_direction?: string, @Query() page?: number, @Query() limit?: number, @Query() search_key?: string, @Query() status?: number): Promise<ApiResponse> {
    //         const request = { sort_column, sort_direction, page, limit, search_key, status }
    //         const wrappedFunc = tryCatchWrapper(handler.getUsersListThroughCache);
    //         return wrappedFunc(request); // Invoking the wrapped function 

    //     }
    //     //ends
}





