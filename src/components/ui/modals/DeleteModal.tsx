"use client"
import React from "react";
import { Modal } from "antd";
import AppButton from "../buttons/AppButton";
import { RiDeleteBin5Fill } from "react-icons/ri";

interface DeleteModalProps {
    openDeleteModal: boolean;
    setopenDeleteModal: (value: boolean) => void;
    handleDelete: () => void;
    title: string;
    loading: boolean;
}

const DeleteModal = ({
    openDeleteModal,
    setopenDeleteModal,
    handleDelete,
    title,
    loading
}: DeleteModalProps) => {
    return (
        <Modal
            open={openDeleteModal}
            onOk={() => setopenDeleteModal(false)}
            onCancel={() => setopenDeleteModal(false)}
            width={400}
            footer={false}
            centered
        >
            <div className="flex flex-col justify-center items-center gap-3 ">
                <RiDeleteBin5Fill size={150} color="red" />
                <h2 className="text-2xl font-bold text-white">Delete {title}?</h2>
                <p className="font-bold text-center text-white">Are you sure you want to delete this {title}?</p>
                <div className="flex gap-4 items-center ">
                    <AppButton isLoading={loading} onClick={handleDelete} className="bg-maincolor! font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg w-32! border-transparent! border-none! outline-none!  shadow-none!" block>
                        Yes
                    </AppButton>
                    <AppButton onClick={() => setopenDeleteModal(false)} className="bg-cream! font-bold text-black! hover:text-black! hover:opacity-100 rounded-lg  w-32! border-transparent! border-none! outline-none!  shadow-none!" block>
                        No
                    </AppButton>
                </div>
            </div>
        </Modal>
    )
}
export default DeleteModal;