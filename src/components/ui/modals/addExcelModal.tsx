"use client"

import React from "react"
import { Form, Modal, Upload, message } from "antd"
import { useAppMutate } from "@/tanstack/useAppMutate";
import { MUTATION_KEYS } from "@/tanstack/keys";
import logger from "@/utils/logger";
import { ENDPOINTS } from "@/Endpoints";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import AppButton from "../buttons/AppButton";
import { FiPlus } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { FiDownload } from "react-icons/fi";

const AddExcelModal = ({ openModal, setOpenModal, excelSampleLink }: { openModal: boolean, setOpenModal: (value: boolean) => void, excelSampleLink?: string }) => {

    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<any[]>([]);

    const { mutateAsync: importExcel, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.EXCEL_IMPORT],
        invalidateQueryKeys: [MUTATION_KEYS.LIST_EXCEL_IMPORTS],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            form.resetFields();
            setFileList([]);
            setOpenModal(false);
        }
    });

    const onFinish = async () => {
        const formData = new FormData();
        const currentFile = fileList[0];

        if (!currentFile?.originFileObj) {
            logger.error("Please upload an excel file");
            return;
        }

        formData.append("file", currentFile.originFileObj);

        await tryCatchWrapper(
            async () => {
                await importExcel({
                    url: ENDPOINTS.PRIVATE.EXCEL_IMPORT,
                    method: "POST",
                    body: formData
                });
            },
            {
                errorMessage: 'Failed to upload file',
                showToast: true,
                onError(error) {
                    logger.error('Failed to upload file', error);
                }
            }
        );
    }


    const customRequest = async (options: any) => {
        const { onSuccess } = options;
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const handleChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
    };
    const handleCancel = () => {
        setOpenModal(false);
        form.resetFields();
        setFileList([]);
    }

    const uploadButton = (
        <div className="flex flex-col items-center justify-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-maincolor transition-colors w-full cursor-pointer bg-gray-50/50">
            <FiPlus size={32} className="text-maincolor mb-2" />
            <div className="text-base font-semibold text-gray-700">Click or drag Excel file to this area</div>
            <div className="text-sm text-gray-500 mt-1">Support for .xlsx, .xls, .csv</div>
        </div>
    );

    return (
        <Modal
            open={openModal}
            onCancel={handleCancel}
            centered
            footer={false}
            destroyOnHidden={true}
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
        >
            <h1 className="text-3xl font-bold text-center text-black">
                Add <span className="text-maincolor">Module Excel</span>
            </h1>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete='off'
                    requiredMark={false}
                    className="space-y-6 text-center text-black!"
                >
                    <Form.Item
                        name="file"
                        rules={[
                            { required: true, message: 'Please upload an excel file' },
                        ]}
                    >
                        <Upload
                            name="file"
                            listType="picture"
                            accept=".xlsx, .xls, .csv"
                            fileList={fileList}
                            onChange={handleChange}
                            customRequest={customRequest}
                            maxCount={1}
                            className='excel-upload-container text-black!'
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <div className="pt-4">
                        <AppButton
                            htmlType="submit"
                            isLoading={isPending}
                            className="bg-maincolor! h-14 text-lg font-bold text-white! hover:opacity-90 rounded-xl border-none! shadow-lg shadow-maincolor/20 transition-all active:scale-[0.98]"
                            block
                        >
                            {isPending ? 'Processing...' : 'Upload and Import Data'}
                        </AppButton>
                    </div>
                    <AppButton
                        onClick={() => {
                            if (excelSampleLink) {
                                window.open(`${excelSampleLink}`, "_blank");
                            }
                        }}
                        icon={<FiDownload />}
                        className="bg-maincolor! h-14 text-lg font-bold text-white! hover:opacity-90 rounded-xl border-none! shadow-lg shadow-maincolor/20 transition-all active:scale-[0.98]"
                        block
                    >
                        Download Sample Excel
                    </AppButton>
                </Form>
            </div>
        </Modal>
    )
}

export default AddExcelModal