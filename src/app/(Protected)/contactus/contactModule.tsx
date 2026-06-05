"use client"

import React from "react"
import { ENDPOINTS } from "@/Endpoints";
import { Form, Input, Modal } from "antd"
import { AppButton } from "@/components/ui";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { useAppMutate } from "@/tanstack/useAppMutate";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";

interface contactDetailProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    isView?: boolean;
    isReply?:boolean;
    ContactID: string;
}
interface ContactUsProps {
    data: {
        name: string;
        email: string;
        message: string;
    };
}

export default function ContactModule({ openModal, setOpenModal, isReply,isView, ContactID }: contactDetailProps) {

    const [form] = Form.useForm();

    const { data: contactUsDetail } = useAppQuery<ContactUsProps>({
        queryKey: [MUTATION_KEYS.CONTACTUS_DETAIL, ContactID],
        url: `${ENDPOINTS.PRIVATE.CONTACTUS_DETAIL}`,
        params: {
            contact_id: ContactID
        },
        options: {
            staleTime: Infinity,
            enabled: openModal && !!ContactID,
        },
    })

    const { mutateAsync: replycontact, isPending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CONTACTUS_REPLY],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenModal(false);
        },
    });

    const handleReply = async () => {

        await tryCatchWrapper(
            async () => {
                await replycontact({
                    url: ENDPOINTS.PRIVATE.CONTACTUS_REPLY,
                    method: "POST",
                    body: {
                        html: form.getFieldValue("reply"),
                        contact_id: ContactID
                    },
                });
            },
            {
                errorMessage: 'Failed to delete contact',
                showToast: true,
                onError() {
                    console.error('Failed to add theme');
                    setOpenModal(false)
                }
            }
        );
    }


    React.useEffect(() => {
        if (openModal && contactUsDetail?.data) {
            form.setFieldsValue(contactUsDetail.data);
        }
    }, [openModal, contactUsDetail, form]);

    React.useEffect(() => {
        if (!openModal) {
            form.resetFields();
        }
    }, [openModal, form]);

    return (
        <div>
            <Modal
                open={openModal}
                onOk={() => setOpenModal(false)}
                onCancel={() => setOpenModal(false)}
                width={400}
                footer={false}
                centered
            >
                <h1 className="text-3xl font-bold text-center text-black">
                    Contact <span className="text-maincolor">Us</span>
                </h1>
                <div className='bg-white rounded-lg p-6 my-5'>
                    <Form
                        form={form}
                        layout="vertical"
                        autoComplete='off'
                        className='w-[95%] mx-auto!'
                        requiredMark={false}
                    >
                        {isView && <>
                            <Form.Item label={<span className='text-black font-semibold text-md'>Name :</span>} name="name">
                                <Input
                                    disabled={isView}
                                    placeholder="Name"
                                    className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                                />
                            </Form.Item>
                            <Form.Item label={<span className='text-black font-semibold text-md'>Email :</span>} name="email">
                                <Input
                                    disabled={isView}
                                    placeholder="Email"
                                    className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                                />
                            </Form.Item>
                            <Form.Item label={<span className='text-black font-semibold text-md'>Message :</span>} name="message">
                                <Input.TextArea
                                    disabled={isView}
                                    placeholder="Message"
                                    className="text-black! bg-white! border-maincolor! border-[1.5px] rounded-lg p-2"
                                />
                            </Form.Item>
                        </>
                        }
                        {isReply &&
                            <Form.Item label={<span className="font-bold text-white">Reply:</span>} name="reply">
                                <Input.TextArea placeholder="Reply" rows={4} className="border-0 bg-gray! outline-none border-radius-lg" />
                            </Form.Item>
                        }
                        <Form.Item className="flex justify-center">
                            <AppButton isLoading={isPending} onClick={() => isView ? setOpenModal(false) : handleReply()} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg w-32! border-transparent! border-none! outline-none!  shadow-none! text-center!" >
                                {isView ? "OK" : "Submit"}
                            </AppButton>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}   