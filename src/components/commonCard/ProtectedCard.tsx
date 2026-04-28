"use client"

import React from 'react'
import { ROUTES } from '@/routerKeys';
import { IoMenu } from "react-icons/io5";
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, Dropdown, Layout, Menu, Space, MenuProps, Image } from 'antd'
import type { MenuItemType as AntMenuItem } from 'antd/es/menu/interface';
import { IoIosArrowDown, IoIosArrowUp, IoIosLogOut } from 'react-icons/io';
import { FaUserCircle } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { MdPolicy } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiSoundModuleFill } from "react-icons/ri";
import { FaQuestionCircle } from "react-icons/fa";
import { useLogout } from '@/hooks/auth/useLogout';

const { Header, Sider, Content } = Layout;

interface SidebarMenuItem {
    routes: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    key: string;
    label: string;
}

interface ProtectedCardProps {
    children: React.ReactNode;
}

const ProtectedCard = ({ children }: ProtectedCardProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useLogout();

    const [activeIndex, setActiveIndex] = React.useState<string>(pathname);

    const [isBreakpoint, setIsBreakpoint] = React.useState<boolean>(false);
    const [collapsed, setCollapsed] = React.useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

    React.useEffect((): void => {
        const pathWithoutQuery = pathname.split('?')[0]; // Remove query parameters

        if (pathWithoutQuery.startsWith(ROUTES.PRIVATE.HOME)) {
            setActiveIndex('/adminData');
        } else {
            setActiveIndex(pathWithoutQuery);
        }
    }, [pathname]);

    const SideList: SidebarMenuItem[] = [
        {
            routes: ROUTES.PRIVATE.HOME,
            icon: (
                <MdDashboard className='text-maincolor! h-8 w-8!' />

            ),
            activeIcon: (
                <MdDashboard className='text-cream! h-8 w-8!' />
            ),
            key: '/adminData',
            label: 'Dashboard',
        },
        {
            routes: ROUTES.PRIVATE.MODULE,
            icon: (
                <RiSoundModuleFill className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <RiSoundModuleFill className='text-cream! h-8 w-8!' />
            ),
            key: '/module',
            label: 'Module',
        },
        {
            routes: ROUTES.PRIVATE.FAQ,
            icon: (
                <FaQuestionCircle className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <FaQuestionCircle className='text-cream! h-8 w-8!' />
            ),
            key: '/faq',
            label: 'FAQ',
        },
        {
            routes: ROUTES.PRIVATE.PRIVACYPOLICY,
            icon: (
                <MdPolicy className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <MdPolicy className='text-cream! h-8 w-8!' />
            ),
            key: '/privacypolicy',
            label: 'Privacy Policy',
        },
        {
            routes: ROUTES.PRIVATE.TERMSANDCONDITION,
            icon: (
                <FaFileAlt className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <FaFileAlt className='text-cream! h-8 w-8!' />
            ),
            key: '/termsandcondition',
            label: 'Terms And Condition',
        },
        {
            routes: ROUTES.PRIVATE.ABOUTUS,
            icon: (
                <FaFileAlt className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <FaFileAlt className='text-cream! h-8 w-8!' />
            ),
            key: '/aboutus',
            label: 'About Us',
        },
        {
            routes: ROUTES.PRIVATE.CONTACTUS,
            icon: (
                <FaPhoneAlt className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <FaPhoneAlt className='text-cream! h-8 w-8!' />
            ),
            key: '/contactus',
            label: 'Contact Us',
        },

    ];


    // Setting Active Sider - Similar to the original code
    React.useEffect((): void => {
        const pathWithoutQuery = pathname.split('?')[0]; // Remove query parameters

        // // Handle dynamic routes
        if (pathWithoutQuery.startsWith('/module')) {
            setActiveIndex(ROUTES.PRIVATE.MODULE); // Match /user_detail/:userId
        }
    }, [pathname]);


    const handleDropdownVisibleChange = (visible: boolean): void => {
        setDropdownOpen(visible);
    };

    const handleMenuItemClick = (key: string): void => {
        setActiveIndex(key);
        const menuItem = SideList.find(item => item.key === key);
        if (menuItem) {
            router.push(menuItem.routes);
        }
    };

    const handleLogout = (): void => {
        logout()
    };

    const handleProfileClick = (): void => {
        // router.push(ROUTES.DASHBOARD.PROFILE);
    }

    const menuItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div className="flex text-maincolor items-center gap-2 h-11 cursor-pointer" onClick={handleProfileClick}>
                    <FaUserCircle className='text-maincolor text-2xl' />
                    My Profile
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div
                    className="flex text-maincolor items-center gap-2 h-11 cursor-pointer"
                    onClick={handleLogout}
                >
                    <IoIosLogOut className='text-maincolor text-2xl' />
                    Logout
                </div>
            ),
        },
    ];

    const antMenuItems: AntMenuItem[] = SideList.map((item) => ({
        key: item.key,
        icon: activeIndex === item.key ? item.activeIcon : item.icon,
        label: (
            <span className={`font-medium ${activeIndex === item.key ? 'text-cream pl-2 ' : 'text-maincolor pl-2'}`}>
                {item.label}
            </span>
        ),
        className: activeIndex === item.key
            ? 'bg-maincolor! border border-maincolor' // Active item - background stays maincolor, text white
            : 'bg-cream hover:bg-cream! border border-maincolor',

    }));

    return (
        <Layout>
            <Header className="bg-cream! sticky top-0 z-50 border border-maincolor flex justify-between items-center rounded-lg px-4 lg:px-8 py-4">
                <div className="flex items-center gap-3">
                    {isBreakpoint ? (
                        <div className='flex gap-2 justify-center items-center'>
                            <Image
                                src='/images/logo.png'
                                height={50}
                                width={60}
                                alt="Logo"
                                className='w-full'
                                preview={false}
                                draggable={false}
                            />
                            <IoMenu
                                className="cursor-pointer h-12 w-16 sm:w-20"
                                onClick={() => setCollapsed(!collapsed)}
                            />
                        </div>
                    ) : (
                        <Image
                            src='/images/logo.png'
                            height={50}
                            width={60}
                            alt="Logo"
                            preview={false}
                            draggable={false}
                        />
                    )}
                </div>
                <Dropdown
                    trigger={['hover', 'click']}
                    placement='bottomRight'
                    menu={{ items: menuItems }}
                    onOpenChange={handleDropdownVisibleChange}
                    open={dropdownOpen}
                    className='bg-cream!'
                >
                    <Space className="bg-cream! h-12 cursor-pointer p-2 rounded-lg border shadow-cardCustom border-maincolor border-solid">
                        <Avatar
                            size={32}
                            src={`/images/logo.png`}
                            alt="Admin Pic"
                        />
                        <p className="font-bold text-maincolor hidden sm:inline">
                            Admin
                        </p>
                        {dropdownOpen ? (
                            <IoIosArrowDown className="text-maincolor" size={20} />
                        ) : (
                            <IoIosArrowUp className="text-maincolor" size={20} />
                        )}
                    </Space>
                </Dropdown>
            </Header>
            <Layout className="h-full p-2">
                <Sider
                    width={280}
                    className='border border-maincolor rounded-lg cursor-pointer bg-cream!'
                    style={{
                        position: 'sticky',
                        top: '110px',
                        height: 'calc(100dvh - 96px)',
                        overflowY: 'auto',
                        zIndex: 40
                    }}
                    trigger={null}
                    breakpoint='md'
                    collapsedWidth="0"
                    collapsed={collapsed}
                    onCollapse={(collapsed) => setCollapsed(collapsed)}
                    onBreakpoint={(broken) => setIsBreakpoint(broken)}
                    zeroWidthTriggerStyle={{ top: 20, backgroundColor: 'transparent' }}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[activeIndex]}
                        onClick={({ key }) => handleMenuItemClick(key as string)}
                        className="border-r-0 rounded-none pl-0 cursor-pointer"
                        items={antMenuItems}
                    />
                </Sider>
                <Content className="p-4 bg-cream! h-[calc(100dvh-120px)] overflow-y-auto">
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default ProtectedCard