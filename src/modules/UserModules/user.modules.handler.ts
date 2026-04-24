import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import statusCodes from '../../constants/statusCodes'
import userAuthModel from "../UserAuth/user.auth.model";
import { USER_STATUS } from "../../constants/workflow.constant";
import adminThemeModel from "../AdminTheme/admin.theme.model";
import { convertToObjectId } from "../../helpers/common.helper";

const UserCommonHandler = {

    themeList: async (data: any, userId: string): Promise<ApiResponse> => {
        const { cursor, limit = 10 } = data;
        const user = await userAuthModel.findOne({
            _id: userId,
            status: USER_STATUS.ACTIVE
        });
        const userLang = user?.language;

        const match: any = {
            status: USER_STATUS.ACTIVE
        };

        if (cursor) {
            const parsedCursor = JSON.parse(cursor);

            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: convertToObjectId(parsedCursor._id) }
                }
            ];
        }

        const themeList = await adminThemeModel.aggregate([
            { $match: match },

            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`
                }
            },

            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },

            {
                $limit: Number(limit)
            }
        ]);

        const last = themeList[themeList.length - 1];

        const nextCursor = last
            ? JSON.stringify({
                createdAt: last.createdAt,
                _id: last._id
            })
            : null;

        return showResponse(true, "success", {
            data: themeList,
            nextCursor
        }, statusCodes.SUCCESS);
    }

}

export default UserCommonHandler 
