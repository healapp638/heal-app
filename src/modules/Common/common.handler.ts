import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import { findAll, findOne, findOneAndUpdate } from "../../helpers/db.helpers";
import responseMessage from '../../constants/responseMessages'
import commonContentModel from "../../modules/AdminCommon/commonContent.model";
import faqModel from "../../modules/AdminCommon/faq.model";
import services from "../../services";
import statusCodes from '../../constants/statusCodes'
import userAuthModel from "../UserAuth/user.auth.model";
import { USER_STATUS } from "../../constants/workflow.constant";


const CommonHandler = {

    getCommonContent: async (type: string, language: string): Promise<ApiResponse> => {
        const doc: any = await commonContentModel.findOne().lean();
        const content = doc?.[type]?.[language] ?? "";
        return showResponse(true, responseMessage.common.data_retreive_sucess, { type, language, content }, statusCodes.SUCCESS)
    },

    getQuestions: async (): Promise<ApiResponse> => {
        const getResponse = await findAll(faqModel, {});
        if (getResponse.status) {
            return showResponse(true, responseMessage.admin.here_is_question, getResponse?.data, statusCodes.SUCCESS)
        }
        return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR)

    },

    storeParameterToAws: async (name: string, value: string): Promise<ApiResponse> => {
        const response = await services.awsService.postParameterToAWS({
            name: name,
            value: value
        })

        if (response) {
            return showResponse(true, responseMessage?.common.parameter_store_post_success, null, statusCodes.SUCCESS);
        }
        return showResponse(false, responseMessage?.common.parameter_store_post_error, null, statusCodes.API_ERROR);
    },


    async deleteAccount(data: any): Promise<ApiResponse> {
    const { email, otp } = data;
    const finduser = await findOne(userAuthModel, {email,status: { $ne: USER_STATUS.DELETED }});
    if (!finduser.status) {
      return showResponse(false,responseMessage.users.not_registered,null,statusCodes.API_ERROR,)
    }
    
    // const isValid = await commonHelper.verifyBycryptHash(password,finduser?.data?.password,);
    if (otp !== finduser?.data?.otp) {
      return showResponse(false,"Incorrect otp",null,statusCodes.API_ERROR,);
    }
    const status = 2;
    const result = await findOneAndUpdate(userAuthModel,{email,status: { $ne: USER_STATUS.DELETED }},{status},);
    if (!result.status) {
      return showResponse(false,responseMessage.users.user_account_update_error,null,statusCodes.API_ERROR,);
    }
    return showResponse(true,`${responseMessage.users.user_account_has_been} deleted Successfully`,null,statusCodes.SUCCESS);
  }, //ends
}

export default CommonHandler 
