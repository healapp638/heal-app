"use client"

import React from "react"
import { AppButton } from "@/components/ui"
import { Image, Select, Switch, Table } from "antd"
import { useRouter } from "next/navigation"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiTrash2, FiEdit } from "react-icons/fi"
import { FaPlus, FaEye } from "react-icons/fa";
import { ColumnsType } from "antd/es/table";
import IconButton from "@/components/ui/IconButton";
import AddCategoryModal from "@/components/ui/modals/addCategoryModal";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { ENDPOINTS } from "@/Endpoints";
import { FILE_URL } from "@/utils/helper";
import { ROUTES } from "@/routerKeys";
import DeleteModal from "@/components/ui/modals/DeleteModal";
import { tryCatchWrapper } from "@/utils/tryCatchWrapper";
import { useAppMutate } from "@/tanstack/useAppMutate";

interface CategoryList {
    _id: string;
    imgUrl: string;
    title: string;
    status: number;
}
interface CategoryListResponse {
    result: CategoryList[];
}

const Category = () => {

    const route = useRouter()
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });
    const [isSelectOpen, setIsSelectOpen] = React.useState(false);
    const [openAddModal, setOpenAddModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState("");

    const [selectedLanguage, setSelectedLanguage] = React.useState<string>('en');

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
    const handleAddHomeTheme = (categoryId: string) => {
        route.push(`${ROUTES.PRIVATE.HOMETHEME}/${categoryId}`)
    }

    const { data: listCategory } = useAppQuery<CategoryListResponse>({
        queryKey: [MUTATION_KEYS.CATEGORY_LIST, pagination, selectedLanguage],
        url: ENDPOINTS.PRIVATE.CATEGORY_LIST,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
            lang: selectedLanguage || "en",
        }
    })
    const CategoryList = listCategory?.data?.result


    const { mutateAsync: DeleteCategory, isPending: isDeleting } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CATEGORY_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.CATEGORY_LIST],
        showSuccessToast: true,
        showErrorToast: true,
        onSuccess: () => {
            setOpenDeleteModal(false);
            setSelectedCategory("");
        }
    });

    const handleDeleteCategory = async () => {
        await tryCatchWrapper(
            async () => {
                await DeleteCategory({
                    url: ENDPOINTS.PRIVATE.CATEGORY_DELETE,
                    method: "DELETE",
                    body: {
                        status: 2,
                        themeCategoryId: selectedCategory,
                    },
                });
            },
            {
                errorMessage: 'Failed to delete category',
                showToast: true,
                onError() {
                    console.error('Failed to delete category');
                    setSelectedCategory("")
                },
            }
        );
    }


    const { mutateAsync: StatusChange, isPending: isStatusChangePending } = useAppMutate({
        mutationKey: [MUTATION_KEYS.CATEGORY_DELETE],
        invalidateQueryKeys: [MUTATION_KEYS.CATEGORY_LIST],
        showSuccessToast: false,
        showErrorToast: true,
    });

    const handleStatusChangeClick = async (categoryId: string, changeStatus: number) => {
        await tryCatchWrapper(
            async () => {
                await StatusChange({
                    url: ENDPOINTS.PRIVATE.CATEGORY_DELETE,
                    method: "DELETE",
                    body: {
                        status: changeStatus,
                        themeCategoryId: categoryId,
                    },
                });
            },
            {
                errorMessage: 'Failed to change status',
                showToast: true,
                onError() {
                    console.error('Failed to change status');
                },
            }
        );
    }

    const columns: ColumnsType<CategoryList> = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: "Category Pic",
            dataIndex: "imgUrl",
            key: "imgUrl",
            render: (imgUrl: string) => <Image
                src={`${FILE_URL}${imgUrl}`}
                alt="image"
                height={72}
                preview={false}
                draggable={false}
                width={72}
                className="w-18 h-18 rounded-lg object-cover"
            />
        },
        {
            title: 'Category Name',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className='font-medium text-black'>{text}</span>
        },
        {
            title: "Status",
            key: 'status',
            render: (_: any, record: any) => {
                const changeStatus = record.status === 1 ? 3 : 1;
                return (
                    <div onClick={(e) => { e.stopPropagation(); }}>
                        <Switch
                            checked={record.status === 1}
                            loading={isStatusChangePending}
                            onChange={() => handleStatusChangeClick(record?._id, changeStatus)}
                        />
                    </div>
                )
            }
        },
        {
            title: "Actions",
            align: "center",
            render: (_: any, record: any) => (
                <div className="flex gap-2  justify-center">
                    <IconButton icon={<FaPlus size={20} />} onClick={(e) => { e.stopPropagation(); handleAddHomeTheme(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FaEye size={20} />} onClick={(e) => { e.stopPropagation(); setOpenViewModal(true); setSelectedCategory(record?._id) }} className="" />
                    <IconButton icon={<FiEdit size={20} />} onClick={(e) => { e.stopPropagation(); setOpenUpdateModal(true); setSelectedCategory(record?._id) }} className="text-maincolor! hover:text-maincolor!" />
                    <IconButton icon={<FiTrash2 size={20} />} onClick={(e) => { e.stopPropagation(); setOpenDeleteModal(true); setSelectedCategory(record?._id) }} className="" />
                </div>
            ),
            width: 200,
        }
    ];


    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4" >
                <h1 className="text-3xl font-bold text-black m-0!">
                    Add <span className="text-maincolor">Category</span>
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
                    <AppButton onClick={() => { setOpenAddModal(true) }} className="bg-maincolor! w-32! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                        Add Category
                    </AppButton>
                </div>
            </div>
            <Table
                dataSource={CategoryList}
                columns={columns}
                onRow={(record) => ({
                    onClick: () => handleAddHomeTheme(record?._id)
                })}
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
                className='cursor-pointer!'
            />
            <AddCategoryModal openModal={openAddModal} setOpenModal={setOpenAddModal} selectedLanguage={selectedLanguage} categoryId={selectedCategory} />
            <AddCategoryModal openModal={openViewModal} setOpenModal={setOpenViewModal} selectedLanguage={selectedLanguage} categoryId={selectedCategory} isView={true} />
            <AddCategoryModal openModal={openUpdateModal} setOpenModal={setOpenUpdateModal} selectedLanguage={selectedLanguage} categoryId={selectedCategory} isUpdate={true} />
            <DeleteModal title='Category' openDeleteModal={openDeleteModal} setopenDeleteModal={setOpenDeleteModal} handleDelete={handleDeleteCategory} loading={isDeleting} />
        </div>
    )
}

export default Category