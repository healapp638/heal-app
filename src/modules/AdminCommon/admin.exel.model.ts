import { Schema, model } from 'mongoose';

const excelContent = new Schema(
    {
        excelTheme:  {
            type: String,
        },
        status:  {
            type: Number,
            default: 1
        }

    },
    { timestamps: true, versionKey: false }
)
export default model('excel_content', excelContent)