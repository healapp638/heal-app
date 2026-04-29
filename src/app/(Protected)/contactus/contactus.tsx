"use client"

import { ENDPOINTS } from '@/Endpoints'
import { MUTATION_KEYS } from '@/tanstack/keys'
import { useAppQuery } from '@/tanstack/useAppQuery'
import { FiTrash2 } from "react-icons/fi"
import { FaEye } from "react-icons/fa";
import { Button, Table } from 'antd'
import React from 'react'
import DeleteModal from '@/components/ui/modals/DeleteModal'
import { tryCatchWrapper } from '@/utils/tryCatchWrapper'
import { useAppMutate } from '@/tanstack/useAppMutate'
import ContactModule from './contactModule'

interface ContactData {
    _id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}
interface ContactResponse {
    result: ContactData[];
}

export default function ContactUs() {

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const [openDeleteModal, setopenDeleteModal] = React.useState(false);
    const [selectedContact, setSelectedContact] = React.useState("");
    const [openContactDetailModal, setOpenContactDetailModal] = React.useState(false);
    const [openContactReplyModal, setOpenContactReplyModal] = React.useState(false);

    const { data: contactUsList } = useAppQuery<ContactResponse>({
        queryKey: [MUTATION_KEYS.CONTACTUS_LIST],
        url: ENDPOINTS.PRIVATE.CONTACTUS_LIST,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: "en",
        }
    })
    const contactUsListData = contactUsList?.data?.result;

    const handleTableChange = (newPagination: any) => {
        setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };

    const { mutateAsync: deletecontact, isPending: isDeleteLoading } = useAppMutate({
        mutationKey: [MUTATION_KEYS.DELETE_CONTACTUS],
        invalidateQueryKeys: [MUTATION_KEYS.CONTACTUS_LIST],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setopenDeleteModal(false);
            setSelectedContact("");
        },
    });

    const handleDelete = async () => {

        await tryCatchWrapper(
            async () => {
                await deletecontact({
                    url: ENDPOINTS.PRIVATE.DELETE_CONTACTUS,
                    method: "DELETE",
                    body: {
                        contact_id: selectedContact,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete contact',
                showToast: true,
                onError() {
                    console.error('Failed to add theme');
                    setopenDeleteModal(false);
                    setSelectedContact("");
                }
            }
        );
    }

    const getSerialNumber = React.useCallback((index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
    }, [pagination]);

    const columns = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_text: any, record: any) => (
                <div className="flex gap-2">
                    <Button icon={<FaEye size={20} />} onClick={() => { setOpenContactDetailModal(true); setSelectedContact(record?._id) }} className="border-0 bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" />
                    <Button icon={<FiTrash2 size={20} />} onClick={() => { setopenDeleteModal(true); setSelectedContact(record._id) }} className="border-0 text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger />
                    <Button onClick={() => { setOpenContactReplyModal(true); setSelectedContact(record?._id) }} className="border-0 text-white! bg-maincolor! hover:bg-maincolor! hover:text-white! shadow-none" danger >Reply</Button>
                </div>
            ),
        }
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold text-black">
                Contact <span className="text-maincolor">Us</span>
            </h1>
            <Table
                columns={columns}
                dataSource={contactUsListData}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    showSizeChanger: false,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    onChange: (page, pageSize) => {
                        setPagination({
                            current: page,
                            pageSize: pageSize || pagination.pageSize,
                        });
                    },
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
                bordered
            />
            <DeleteModal
                openDeleteModal={openDeleteModal}
                setopenDeleteModal={setopenDeleteModal}
                handleDelete={handleDelete}
                title="Contact Us"
                loading={isDeleteLoading}
            />
            <ContactModule
                openModal={openContactDetailModal}
                setOpenModal={setOpenContactDetailModal}
                isView={true}
                ContactID={selectedContact}
            />
            <ContactModule
                openModal={openContactReplyModal}
                setOpenModal={setOpenContactReplyModal}
                isView={false}
                ContactID={selectedContact}
            />
        </div>
    )
}
