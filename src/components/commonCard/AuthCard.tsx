import React, { ReactNode } from 'react'
import { ScaleIn } from '../animations'
import { Image } from 'antd'

const AuthCard = ({ children }: { children: ReactNode }) => {
    return (
        <div className='flex items-center  justify-center min-h-screen w-full p-4 '>
            <div className='w-full max-w-xl border-2 border-cream! rounded-2xl mx-auto'>
                <ScaleIn duration={0.5}>
                    <div className="bg-cream! rounded-lg">
                        <div className='rounded-lg py-4 flex justify-center'>
                            <Image src={'/images/logo.png'} height={240} alt="SachTech Logo" className='w-full!' preview={false} draggable={false} />
                        </div>
                        <div className='p-4'>
                            {children}
                        </div>
                    </div>
                </ScaleIn>
            </div>
        </div>
    )
}

export default AuthCard