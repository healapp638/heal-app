"use client"

import React from "react"
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { Form, Input, Modal, Upload } from "antd";
import { RxCross2 } from "react-icons/rx";
import { FiPlus } from "react-icons/fi"
import AppButton from "../buttons/AppButton";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { FILE_URL } from "@/utils/helper";

interface EditProfileModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}

interface AdminDetail {
    first_name: string;
    last_name: string;
    profile_pic: string;
    full_name: string;
    email: string;
}

const EditProfileModal = ({ openModal, setOpenModal }: EditProfileModalProps) => {

    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<any[]>([]);
    const [fileUrl, setFileUrl] = React.useState<string>("");
    const fileListRef = React.useRef<any[]>([]);

    const handleCancel = () => {
        setOpenModal(false);
    };

    const { data: adminDetail } = useAppQuery<AdminDetail>({
        queryKey: [MUTATION_KEYS.ADMIN_DETAIL],
        url: ENDPOINTS.PRIVATE.ADMIN_DETAIL,
        options: { staleTime: 0 },
    });
    const AdminDetail = adminDetail?.data

    React.useEffect(() => {
        if (AdminDetail) {
            const { first_name: firstName, last_name: lastName, profile_pic: profilePic } = AdminDetail;
            form.setFieldsValue({
                first_name: firstName,
                last_name: lastName,
            });
            if (profilePic) {
                setFileUrl(FILE_URL + profilePic);
                const fileObj = {
                    uid: '-1',
                    name: 'profile_pic',
                    status: 'done',
                    url: FILE_URL + profilePic,
                };
                setFileList([fileObj]);
                fileListRef.current = [fileObj];
                form.setFieldsValue({ profile_pic: [fileObj] });
            }
        }
    }, [AdminDetail, form, openModal]);


    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useAppMutate({
        mutationKey: [MUTATION_KEYS.PROFILE_EDIT],
        invalidateQueryKeys: [MUTATION_KEYS.ADMIN_DETAIL],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess() {
            handleCancel();
        },
    });

    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("first_name", values.first_name);
        formData.append("last_name", values.last_name);

        const currentFile = fileList[0];
        if (currentFile?.originFileObj) {
            // New file selected
            formData.append("profile_pic", currentFile.originFileObj);
        } else if (fileUrl) {
            // Keep existing URL
            formData.append("profile_pic", fileUrl);
        }

        await tryCatchWrapper(
            async () => {
                await updateProfile({
                    url: ENDPOINTS.PRIVATE.PROFILE_EDIT,
                    method: "PUT",
                    body: formData
                });
            },
            {
                errorMessage: 'Failed to upload file',
                showToast: true,
                onError() {
                    // Optionally handle error state here
                    console.error('Failed to upload file');
                }
            }
        );
    }


    const customRequest = async (options: any) => {
        const { onSuccess } = options;
        // Mock success directly since we are handling file in form submission
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const handleChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
        fileListRef.current = newFileList;
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center text-gray-500">
            <FiPlus size={24} />
            <div className="mt-2 text-sm">Upload</div>
        </div>
    );

    return (
        <Modal
            open={openModal}
            onCancel={handleCancel}
            footer={false}
            centered
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
        >
            <h1 className="text-3xl font-bold text-center text-black">
                Edit <span className="text-maincolor">Profile</span>
            </h1>
            <Form
                form={form}
                layout="vertical"
                autoComplete='off'
                onFinish={onFinish}
                requiredMark={false}
                className='w-[95%] mx-auto!'
            >
                <Form.Item
                    name="imgUrl"
                    rules={[
                        { required: true, message: 'Please enter theme image' },
                    ]}
                    className='flex justify-center'
                >
                    <Upload
                        name="imgUrl"
                        listType="picture-card"
                        accept="image/*"
                        fileList={fileList}
                        onChange={handleChange}
                        customRequest={customRequest}
                        maxCount={1}
                        className='flex justify-center w-fit rounded-lg p-2'
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="first_name"
                    label={<span className='text-black font-semibold text-md'>First Name :</span>}
                    rules={[
                        { required: true, message: 'Please enter first name' },
                    ]}
                >
                    <Input
                        placeholder="First Name"
                        className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                    />
                </Form.Item>
                <Form.Item
                    name="last_name"
                    label={<span className='text-black font-semibold text-md'>Last Name :</span>}
                    rules={[
                        { required: true, message: 'Please enter last name' },
                    ]}
                >
                    <Input
                        placeholder="Last Name"
                        className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                    />
                </Form.Item>
                <Form.Item>
                    <AppButton isLoading={isUpdatingProfile} htmlType="submit" className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!" block>
                        Update Profile
                    </AppButton>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default EditProfileModal