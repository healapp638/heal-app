"use client"

import React from "react";
import { AppButton } from "@/components/ui";
import IconButton from "@/components/ui/IconButton";
import { FaEye } from "react-icons/fa";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { Select, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import AddAffirmationModal from "@/components/ui/modals/addAffirmationModal";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { ENDPOINTS } from "@/Endpoints";
import logger from "@/utils/logger";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { useAppMutate } from "@/tanstack/useAppMutate";

interface Affirmation {
    _id: string;
    affirmation: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

interface AffiliationListData {
    result: Affirmation[]

}

const Affirmation = () => {

    const [isSelectOpen, setIsSelectOpen] = React.useState(false);
    const [openAddAffirmation, setOpenAddAffirmation] = React.useState(false);
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>('en');
    const [AffiliationId, setAffiliationId] = React.useState<string>('');
    const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const { data: AffiliationList } = useAppQuery<AffiliationListData>({
        queryKey: [MUTATION_KEYS.LIST_AFFILIATION, selectedLanguage],
        url: ENDPOINTS.PRIVATE.LIST_AFFILIATION,
        options: {
            staleTime: Infinity,
        },
        params: {
            language: selectedLanguage,
        }
    })
    const affiliationListData = AffiliationList?.data?.result ?? []
    logger.log("AffiliationList", affiliationListData)

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const LANGUAGE_OPTIONS = [
        { value: 'en', label: 'English' },
        { value: 'zh', label: 'Chinese' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'hi', label: 'Hindi' },
        { value: 'de', label: 'German' },
        { value: 'ru', label: 'Russian' },
        { value: 'pt', label: 'Portuguese' },
        { value: 'it', label: 'Italian' },
        { value: 'ro', label: 'Romanian' }
    ];
    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value);
    };
    const getSerialNumber = React.useCallback((index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
    }, [pagination]);

    // Handle pagination change
    const handleTableChange = (newPagination: any) => {
        setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };

      const { mutateAsync: StatusAffirmation, isPending: isStatusPending } = useAppMutate({
            mutationKey: [MUTATION_KEYS.DELETE_AFFILIATION],
            invalidateQueryKeys: [MUTATION_KEYS.LIST_AFFILIATION],
            showSuccessToast: false,
            showErrorToast: true,
        });

     const { mutateAsync: DeleteAffirmation, isPending: isDeleting } = useAppMutate({
            mutationKey: [MUTATION_KEYS.DELETE_AFFILIATION],
            invalidateQueryKeys: [MUTATION_KEYS.LIST_AFFILIATION],
            showSuccessToast: true,
            showErrorToast: true,
            onSuccess: () => {
                setOpenDeleteModal(false);
                setAffiliationId("");
            }
        });
    
        const handleDelete = async () => {
            await tryCatchWrapper(
                async () => {
                    await DeleteAffirmation({
                        url: ENDPOINTS.PRIVATE.DELETE_AFFILIATION,
                        method: "PUT",
                        body: {
                            status: 2,
                            affirmation_id:AffiliationId,
                        },
                    });
                },
                {
                    errorMessage: 'Failed to delete theme',
                    showToast: true,
                    onError() {
                        console.error('Failed to delete theme');
                        setAffiliationId("")
                    },
                }
            );
        }

         const handleUpdateStatus = async (id:string,status: number) => {
            await tryCatchWrapper(
                async () => {
                    await StatusAffirmation({
                        url: ENDPOINTS.PRIVATE.DELETE_AFFILIATION,
                        method: "PUT",
                        body: {
                            status: status,
                            affirmation_id:id,
                        },
                    });
                },
                {
                    errorMessage: 'Failed to delete theme',
                    showToast: true,
                    onError() {
                        console.error('Failed to delete theme');
                        setAffiliationId("")
                    },
                }
            );
        }


    const columns: ColumnsType<Affirmation> = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: Affirmation, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: 'Affirmation',
            dataIndex: 'affirmation',
            key: 'affirmation',
            render: (_: any, record: any) => (
                <span className='text-black!'>{record?.affirmation}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, record: any) => {
                const changeStatus = record.status === 1 ? 3 : 1;
                return (
                    <div onClick={(e) => { e.stopPropagation(); }}>
                        <Switch
                        loading={isStatusPending}
                            checked={record.status === 1}
                            onChange={() => { handleUpdateStatus(record._id,changeStatus)}} />
                    </div>
                )
            }
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: "center",
            render: (_text: any, record: any) => (
                <div className="flex gap-2 justify-center">
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setOpenViewModal(true); setAffiliationId(record?._id) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setOpenUpdateModal(true); setAffiliationId(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeleteModal(true); setAffiliationId(record?._id) }} className="" />
                </div>
            ),
        },
    ];

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-black">
                    Add <span className="text-maincolor">Affirmation</span>
                </h1>
                <div className='flex justify-center gap-2'>
                    <Select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        options={LANGUAGE_OPTIONS}
                        onDropdownVisibleChange={(open) => setIsSelectOpen(open)}
                        className='w-32 bg-maincolor! font-bold text-white! border-none!'
                        suffixIcon={isSelectOpen ? <IoIosArrowUp className="text-white!" /> : <IoIosArrowDown className="text-white!" />}
                    />
                    <AppButton onClick={() => { setOpenAddAffirmation(true) }} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add Affirmation
                    </AppButton>
                </div>
            </div>
            <Table
                dataSource={affiliationListData}
                columns={columns}
                rowKey="_id"
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
                className="cursor-pointer"
            />
            <AddAffirmationModal openModal={openAddAffirmation} setOpenModal={setOpenAddAffirmation} />
            <AddAffirmationModal openModal={openUpdateModal} setOpenModal={setOpenUpdateModal} isUpdate={true} AffiliationID={AffiliationId} selectedLanguage={selectedLanguage} />
            <AddAffirmationModal openModal={openViewModal} setOpenModal={setOpenViewModal} isView={true} AffiliationID={AffiliationId} selectedLanguage={selectedLanguage} />
            <DeleteModal openDeleteModal={openDeleteModal} setopenDeleteModal={setOpenDeleteModal} title="Affiliation"  handleDelete={handleDelete} loading={isDeleting}/>
        </div>
    )
}

export default Affirmation;