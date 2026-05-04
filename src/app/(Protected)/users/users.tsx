"use client"

import React from "react"
import { Table } from "antd"
import logger from "@/utils/logger"
import { ENDPOINTS } from "@/Endpoints"
import { ColumnsType } from "antd/es/table"
import { MUTATION_KEYS } from "@/tanstack/keys"
import { useAppQuery } from "@/tanstack/useAppQuery"

export default function Users() {

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const { data: userList } = useAppQuery<any>({
        queryKey: [MUTATION_KEYS.USERS_LIST, pagination],
        url: ENDPOINTS.PRIVATE.USERS_LIST,
        options: {
            staleTime: Infinity,
        },
        params: {
            page: pagination.current,
            pageSize: pagination.pageSize
        }
    })
    const UserList=userList?.data?.result;
    logger.log("userList", userList?.data?.result)

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

    const columns: ColumnsType<any>=[
         {
            title: 'Sr. No.',
            key: 'number',
            render: (_: any, __: any, index: number) => (
                <span className='text-black'>{getSerialNumber(index)}</span>
            ),
        },
    ]

    return (
        <div className='p-2 md:p-6'>
            <h1 className="text-3xl font-bold text-black">
                Users <span className="text-maincolor">List</span>
            </h1>
            <Table
                rowKey="_id"
                dataSource={UserList}
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
            />

        </div>
    )
}