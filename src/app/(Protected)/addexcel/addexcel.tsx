"use client"

import React from "react"
import { AppButton } from "@/components/ui";
import { Table } from "antd"
import { ENDPOINTS } from "@/Endpoints";
import { MUTATION_KEYS } from "@/tanstack/keys";
import { useAppQuery } from "@/tanstack/useAppQuery";
import { ColumnType } from "antd/es/table";
import AddExcelModal from "@/components/ui/modals/addExcelModal";

interface ExcelDataType {
    _id: string,
    updatedAt: string,
    status: number,
    excelTheme: string,
    createdAt: string
}

interface ResponseType {
    excel_format: string,
    result: ExcelDataType[]
}

const AddExcel = () => {


    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const [openModal, setOpenModal] = React.useState(false);
    const { data: excelData } = useAppQuery<ResponseType>({
        queryKey: [MUTATION_KEYS.LIST_EXCEL_IMPORTS],
        url: ENDPOINTS.PRIVATE.LIST_EXCEL_IMPORTS,
        options: {
            staleTime: 0,
            refetchInterval: 5000, // Refetch every 5 seconds
        },
    });
    const ExcelsampleLink = excelData?.data?.excel_format
    const ExcelListData = excelData?.data?.result

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

    const columns: ColumnType<ExcelDataType>[] = [
        {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
        {
            title: 'Excel Name',
            dataIndex: 'excelTheme',
            key: 'excelTheme',
            render: (text: string) => <span className='font-medium text-black'>{text || "N/A"}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => {
                switch (status) {
                    case 1: return <span className="text-blue-500 font-semibold">Pending</span>;
                    case 2: return <span className="text-orange-500 font-semibold">In Progress</span>;
                    case 3: return <span className="text-green-500 font-semibold">Completed</span>;
                    case 0: return <span className="text-red-500 font-semibold">Failed</span>;
                    default: return <span className="text-gray-500 font-semibold">Unknown</span>;
                }
            }
        },

    ];

    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-black">
                    Module <span className="text-maincolor">Excel Data</span>
                </h1>
                <AppButton onClick={() => setOpenModal(true)} className="bg-maincolor! w-36! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none! cursor-pointer!  shadow-none!" block>
                    Add Module Excel
                </AppButton>
            </div>
            <Table
                rowKey="_id"
                dataSource={ExcelListData}
                columns={columns}
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
            <AddExcelModal openModal={openModal} setOpenModal={setOpenModal} excelSampleLink={ExcelsampleLink} />

        </div>
    )
}

export default AddExcel