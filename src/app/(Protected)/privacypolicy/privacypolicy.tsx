"use client"

import React from 'react'
import { Select } from 'antd'
import { ENDPOINTS } from '@/Endpoints'
import { AppButton } from '@/components/ui'
import { MUTATION_KEYS } from '@/tanstack/keys'
import { useAppQuery } from '@/tanstack/useAppQuery'
import { useAppMutate } from '@/tanstack/useAppMutate'
import CustomEditor from '@/components/ui/CustomEditor'
import logger from '@/utils/logger'
import { tryCatchWrapper } from '@/utils/tryCatchWrapper'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface CommonApiResponse {
    type: string;
    language: string;
    content: string
}

export default function PrivacyPolicy() {

    const [isSelectOpen, setIsSelectOpen] = React.useState(false);
    const [editorContent, setEditorContent] = React.useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>('en');


    const LANGUAGE_OPTIONS = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'ru', label: 'Russian' },
        { value: 'it', label: 'Italian' },
        { value: 'pt', label: 'Portuguese' },
    ];
    
    const { mutateAsync: updateContent } = useAppMutate({
        mutationKey: [MUTATION_KEYS.UPDATE_COMMON_CONTENT],
        invalidateQueryKeys: [MUTATION_KEYS.COMMON_CONTENT],
        showSuccessToast: true,
        showErrorToast: true,
    });

    const { mutateAsync: resetContent } = useAppMutate({
        mutationKey: [MUTATION_KEYS.RESET_COMMON_CONTENT],
        invalidateQueryKeys: [MUTATION_KEYS.COMMON_CONTENT],
        showSuccessToast: true,
        showErrorToast: true,
    });

    const { data: CommonContentList } = useAppQuery<CommonApiResponse>({
        queryKey: [MUTATION_KEYS.COMMON_CONTENT, selectedLanguage, "privacy_policy"],
        url: ENDPOINTS.COMMON.COMMON_CONTENT,
        options: {
            staleTime: Infinity,
        },
        params: {
            lang: selectedLanguage,
            type: "privacy_policy"
        }
    })

    React.useEffect(() => {
        if (CommonContentList?.status) {
            setEditorContent(CommonContentList?.data?.content || '')
        }
    }, [CommonContentList])

    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value);
    };

    const UpdateCommonContent = async () => {

        await tryCatchWrapper(
            async () => {
                await updateContent({
                    url: ENDPOINTS.PRIVATE.UPDATE_COMMON_CONTENT,
                    method: "PUT",
                    body: {
                        language: selectedLanguage,
                        content: editorContent,
                        type: "privacy_policy"
                    },
                });
            },
            {
                errorMessage: 'Failed to update Privacy Policy content',
                showToast: true,
                onError(error) {
                    logger.error('Failed to update Privacy Policy content', error);
                }
            }
        );
    }

    const ResetCommonContent = async () => {

        await tryCatchWrapper(
            async () => {
                await resetContent({
                    url: ENDPOINTS.PRIVATE.RESET_COMMON_CONTENT,
                    method: "PUT",
                    body: {
                        type: "privacy_policy"
                    },
                });
            },
            {
                errorMessage: 'Failed to reset Privacy Policy content',
                showToast: true,
                onError(error) {
                    logger.error('Failed to reset Privacy Policy content', error);
                }
            }
        );
    }

    return (
        <div className='p-2 md:p-6'>
            <div>
                <h1 className="text-3xl font-bold text-black">
                    Privacy  <span className="text-maincolor">Policy</span>
                </h1>
            </div>
            <div className='flex justify-between items-center gap-2 my-2'>
                <Select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    options={LANGUAGE_OPTIONS}
                    onOpenChange={(open) => setIsSelectOpen(open)}
                    className='w-32 bg-maincolor! font-bold text-white! border-none!'
                    suffixIcon={isSelectOpen ? <IoIosArrowUp className="text-white!" /> : <IoIosArrowDown className="text-white!" />}
                />
                <div className='flex flex-wrap gap-4'>
                    <AppButton
                        onClick={UpdateCommonContent}
                        className="bg-maincolor! w-fit font-bold text-white! hover:text-white! hover:opacity-100 rounded-lg  border-transparent! border-none! outline-none!  shadow-none!"
                    >
                        Update
                    </AppButton>
                    <AppButton
                        ghost={true}
                        onClick={ResetCommonContent}
                        className='bg-black! w-fit font-bold text-white! hover:text-white! hover:bg-black! hover:border-none!'
                    >
                        Reset
                    </AppButton>
                </div>
            </div>
            <div className='overflow-auto text-black! h-[calc(100vh-12rem)]'>
                <CustomEditor
                    editorData={editorContent}
                    setEditorData={setEditorContent}
                />
            </div>
        </div>
    )
}
