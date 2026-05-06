import React from 'react'

const IconButton = ({ icon, onClick, className, disabled }: { icon: React.ReactNode, onClick: (e: React.MouseEvent) => void, className?: string, disabled?: boolean }) => {
    return (
        <button onClick={onClick} className={`${className} !bg-transparent hover:!bg-red-200 hover:!rounded-full p-3 hover:scale-105 transition-all cursor-pointer !text-red-500 !border-0 !shadow-none!`} disabled={disabled} >
            {icon}
        </button>
    )
}

export default IconButton