"use client"
import React from "react";
import { Modal } from "antd";
import AppButton from "../buttons/AppButton";
import { FiTrash2 } from "react-icons/fi"

import { RxCross2 } from "react-icons/rx";


interface DeleteModalProps {
    openDeleteModal: boolean;
    setopenDeleteModal: (value: boolean) => void;
    handleDelete?: () => void;
    title: string;
    loading?: boolean;
}

const DeleteModal = ({ openDeleteModal, setopenDeleteModal, handleDelete, title, loading }: DeleteModalProps) => {
    return (
        <Modal
            open={openDeleteModal}
            onOk={() => setopenDeleteModal(false)}
            onCancel={() => setopenDeleteModal(false)}
            closeIcon={<div className={'bg-maincolor text-white flex justify-center items-center rounded-full p-1.5 relative -top-2 -right-2'}><RxCross2 style={{ fontSize: 18 }} /></div>}
            width={400}
            footer={false}
            centered
        >
            <div className="flex flex-col justify-center items-center gap-3 ">
                <FiTrash2 size={150} color="#F66F76" />
                <h2 className="text-2xl font-bold text-black ">Delete <span className="text-maincolor">{title}</span>?</h2>
                <p className="font-bold text-center text-black">Are you sure you want to delete this <span className="text-maincolor">{title}</span>?</p>
                <div className="flex gap-4 items-center ">
                    <AppButton isLoading={!!loading} onClick={handleDelete} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg w-32! border-transparent! border-none! outline-none!  shadow-none!" block>
                        Yes
                    </AppButton>
                    <AppButton onClick={() => setopenDeleteModal(false)} className="bg-cream! border border-maincolor! font-bold text-black! hover:text-black! hover:opacity-100 rounded-lg  w-32! outline-none!  shadow-none!" block>
                        No
                    </AppButton>
                </div>
            </div>
        </Modal>
    )
}
export default DeleteModal;