"use client"

import React from 'react'
import { Select } from 'antd'
import { ENDPOINTS } from '@/Endpoints'
import { AppButton } from '@/components/ui'
import { MUTATION_KEYS } from '@/tanstack/keys'
import { useAppQuery } from '@/tanstack/useAppQuery'
import { useAppMutate } from '@/tanstack/useAppMutate'
import CustomEditor from '@/components/ui/CustomEditor'
import { tryCatchWrapper } from '@/utils/tryCatchWrapper'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface CommonApiResponse {
    type: string;
    language: string;
    content: string
}

export default function TermsAndCondition() {
    
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
        queryKey: [MUTATION_KEYS.COMMON_CONTENT, selectedLanguage, "terms_conditions"],
        url: ENDPOINTS.COMMON.COMMON_CONTENT,
        options: {
            staleTime: Infinity,
        },
        params: {
            lang: selectedLanguage,
            type: "terms_conditions"
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
                        type: "terms_conditions"
                    },
                });
            },
            {
                errorMessage: 'Failed to add theme',
                showToast: true,
                onError() {
                    console.error('Failed to add theme');
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
                        type: "terms_conditions"
                    },
                });
            },
            {
                errorMessage: 'Failed to add theme',
                showToast: true,
                onError() {
                    console.error('Failed to add theme');
                }
            }
        );
    }

    return (
        <div className='p-2 md:p-6'>
            <div>
                <h1 className="text-3xl font-bold text-black">
                    Terms and <span className="text-maincolor">Condition</span>
                </h1>
            </div>
            <div className='flex justify-between items-center gap-2 my-2'>
                <Select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    options={LANGUAGE_OPTIONS}
                    onDropdownVisibleChange={(open) => setIsSelectOpen(open)}
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
            <div className='max-h-screen overflow-auto text-black!'>
                <CustomEditor
                    editorData={editorContent}
                    setEditorData={setEditorContent}
                />
            </div>
        </div>
    )
}
