'use client'

import { AppLogo, ThemeSwitcher } from '@/components/ui'
import React, { useState } from 'react'
import { Button, Dropdown, Avatar } from 'antd'
import { ROUTES } from '@/routerKeys'
import { useRouter } from 'next/navigation'
import { useLogout } from '@/hooks/auth/useLogout'
import { MenuOutlined, UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons'
import { FadeIn } from '@/components/animations'
import { useAppQuery } from '@/tanstack/useAppQuery'
import { QUERY_KEYS } from '@/tanstack/keys'
import { SHOW_THEME_SWITCHER } from '@/config'

const ProtectedHeader = () => {
    const router = useRouter()
    const logout = useLogout()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { data: user } = useAppQuery<any>({
        queryKey: [QUERY_KEYS.USER],
        url: 'admin/auth/me', // Example/Placeholder endpoint
        options: {
            staleTime: Infinity,
        }
    })

    const menuItems = [
        {
            key: 'home',
            label: 'Home',
            icon: <HomeOutlined />,
            onClick: () => {
                router.push(ROUTES.PRIVATE.HOME)
                setMobileMenuOpen(false)
            }
        },
        {
            key: 'profile',
            label: 'My Profile',
            icon: <UserOutlined />,
            onClick: () => {
                router.push(ROUTES.PRIVATE.PROFILE)
                setMobileMenuOpen(false)
            }
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => {
                logout()
                setMobileMenuOpen(false)
            }
        },
    ]

    return (
        <FadeIn direction="down" duration={0.5}>
            <header className="bg-card border border-border rounded-xl shadow-lg mb-6 overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div
                            onClick={() => router.push(ROUTES.PRIVATE.HOME)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <AppLogo />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-3">

                            {SHOW_THEME_SWITCHER && <ThemeSwitcher />}

                            <Button
                                onClick={() => router.push(ROUTES.PRIVATE.HOME)}
                                type="text"
                                size="large"
                                icon={<HomeOutlined />}
                                className="hover:bg-primary/10"
                            >
                                Home
                            </Button>

                            <Button
                                onClick={() => router.push(ROUTES.PRIVATE.PROFILE)}
                                type="default"
                                size="large"
                                icon={<UserOutlined />}
                            >
                                My Profile
                            </Button>

                            <Button
                                onClick={logout}
                                type="primary"
                                danger
                                size="large"
                                icon={<LogoutOutlined />}
                            >
                                Logout
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-2">
                            {SHOW_THEME_SWITCHER && <ThemeSwitcher />}

                            <Dropdown
                                menu={{ items: menuItems }}
                                trigger={['click']}
                                placement="bottomRight"
                                open={mobileMenuOpen}
                                onOpenChange={setMobileMenuOpen}
                            >
                                <Button
                                    type="text"
                                    size="large"
                                    icon={<MenuOutlined />}
                                    className="hover:bg-primary/10"
                                />
                            </Dropdown>
                        </div>
                    </div>

                    {/* User Info Bar (Optional - shows on larger screens) */}
                    {user?.email && (
                        <div className="hidden lg:flex items-center gap-2 mt-3 pt-3 border-t border-border">
                            <Avatar
                                size="small"
                                icon={<UserOutlined />}
                                className="bg-primary"
                            />
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-foreground">
                                    {user?.name || 'User'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </FadeIn>
    )
}

export default ProtectedHeader