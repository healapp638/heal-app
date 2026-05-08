"use client"

import React from 'react'
import { ROUTES } from '@/routerKeys';
import { IoMenu } from "react-icons/io5";
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, Dropdown, Layout, Menu, Space, MenuProps, Image } from 'antd'
import type { MenuItemType as AntMenuItem } from 'antd/es/menu/interface';
import { IoIosArrowDown, IoIosArrowUp, IoIosLogOut } from 'react-icons/io';
import { FaUser, FaUserCircle, FaFileAlt } from 'react-icons/fa';
import { MdSubtitles, MdCategory } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiSoundModuleFill } from "react-icons/ri";
import { useLogout } from '@/hooks/auth/useLogout';
import { useAppQuery } from '@/tanstack/useAppQuery';
import { MUTATION_KEYS } from '@/tanstack/keys';
import { ENDPOINTS } from '@/Endpoints';
import { FILE_URL } from '@/utils/helper';

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

interface UserDetails {
    first_name: string;
    profile_pic: string;
    email: string;
    last_name: string;
}

const ProtectedCard = ({ children }: ProtectedCardProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useLogout();

    const [activeIndex, setActiveIndex] = React.useState<string>(pathname);

    const [isBreakpoint, setIsBreakpoint] = React.useState<boolean>(false);
    const [collapsed, setCollapsed] = React.useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);


    const { data: adminDetail } = useAppQuery<UserDetails>({
        queryKey: [MUTATION_KEYS.ADMIN_DETAIL],
        url: ENDPOINTS.PRIVATE.ADMIN_DETAIL,
        options: { staleTime: 0 },
    });
    const AdminDetail = adminDetail?.data

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
                <MdDashboard className='text-white! h-8 w-8!' />
            ),
            key: '/adminData',
            label: 'Dashboard',
        },
        {
            routes: ROUTES.PRIVATE.USERS,
            icon: (
                <FaUser className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <FaUser className='text-white! h-8 w-8!' />
            ),
            key: '/users',
            label: 'Users',
        },
        {
            routes: ROUTES.PRIVATE.MODULE,
            icon: (
                <RiSoundModuleFill className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <RiSoundModuleFill className='text-white! h-8 w-8!' />
            ),
            key: '/module',
            label: 'Module',
        },
        {
            routes: ROUTES.PRIVATE.ADDEXCEL,
            icon: (
                <FaFileExcel className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <FaFileExcel className='text-white! h-8 w-8!' />
            ),
            key: '/addexcel',
            label: 'Add Excel',
        },
        {
            routes: ROUTES.PRIVATE.AFFIRMATION,
            icon: (
                <MdSubtitles className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <MdSubtitles className='text-white! h-8 w-8!' />
            ),
            key: '/affirmation',
            label: 'Affirmation',
        },
        {
            routes: ROUTES.PRIVATE.CATEGORY,
            icon: (
                <MdCategory className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <MdCategory className='text-white! h-8 w-8!' />
            ),
            key: '/category',
            label: 'Category',
        },
        // {
        //     routes: ROUTES.PRIVATE.FAQ,
        //     icon: (
        //         <FaQuestionCircle className='text-maincolor! h-8 w-8!' />
        //     ),
        //     activeIcon: (
        //         <FaQuestionCircle className='text-cream! h-8 w-8!' />
        //     ),
        //     key: '/faq',
        //     label: 'FAQ',
        // },
        {
            routes: ROUTES.PRIVATE.PRIVACYPOLICY,
            icon: (
                <MdPolicy className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <MdPolicy className='text-white! h-8 w-8!' />
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
                <FaFileAlt className='text-white! h-8 w-8!' />
            ),
            key: '/termsandcondition',
            label: 'Terms And Condition',
        },
        // {
        //     routes: ROUTES.PRIVATE.ABOUTUS,
        //     icon: (
        //         <FaFileAlt className='text-maincolor! h-8 w-8!' />
        //     ),
        //     activeIcon: (
        //         <FaFileAlt className='text-cream! h-8 w-8!' />
        //     ),
        //     key: '/aboutus',
        //     label: 'About Us',
        // },
        {
            routes: ROUTES.PRIVATE.CONTACTUS,
            icon: (
                <FaPhoneAlt className='text-maincolor! h-8 w-8!' />
            ),
            activeIcon: (
                <FaPhoneAlt className='text-white! h-8 w-8!' />
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
        else if (pathWithoutQuery.startsWith('/users')) {
            setActiveIndex(ROUTES.PRIVATE.USERS); // Match /user_detail/:userId
        }
        else if (pathWithoutQuery.startsWith('/category')) {
            setActiveIndex(ROUTES.PRIVATE.CATEGORY); // Match /user_detail/:userId
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
        router.push(ROUTES.PRIVATE.PROFILE);
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
            <span className={`font-medium ${activeIndex === item.key ? 'text-white! pl-2 ' : 'text-maincolor pl-2'}`}>
                {item.label}
            </span>
        ),
        className: activeIndex === item.key
            ? 'bg-maincolor!' // Active item - background stays maincolor, text white
            : 'bg-white  bg-lightmaincolor! hover:bg-lightmaincolor!',

    }));

    return (
        <Layout>
            <Header className="bg-white! sticky top-0 z-50 shadow-sm! flex justify-between items-center rounded-lg px-4 lg:px-8 py-4">
                <div className="flex items-center gap-3">
                    {isBreakpoint ? (
                        <div className='flex gap-2 justify-center items-center'>
                            <Image
                                src='/images/logo.png'
                                alt="Logo"
                                className="h-[41px]! object-contain"
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
                            alt="Logo"
                            preview={false}
                            draggable={false}
                            className="h-[41px]! object-contain"
                        />
                    )}
                </div>
                <Dropdown
                    trigger={['hover', 'click']}
                    placement='bottomRight'
                    menu={{ items: menuItems }}
                    onOpenChange={handleDropdownVisibleChange}
                    open={dropdownOpen}
                    className='bg-white!'
                >
                    <Space className="bg-white! h-12 cursor-pointer p-2 rounded-lg border shadow-cardCustom border-maincolor border-solid">
                        <Avatar
                            size={32}
                            src={`${FILE_URL}${AdminDetail?.profile_pic || ""}`}
                            alt="Admin Pic"
                        />
                        <p className="font-bold text-maincolor hidden sm:inline">
                            {AdminDetail?.first_name}
                        </p>
                        {dropdownOpen ? (
                            <IoIosArrowDown className="text-maincolor" size={20} />
                        ) : (
                            <IoIosArrowUp className="text-maincolor" size={20} />
                        )}
                    </Space>
                </Dropdown>
            </Header>
            {/* <Divider className='text-maincolor! bg-maincolor! h-0.25'/> */}
            <Layout className="h-full p-2">
                <Sider
                    width={280}
                    className='rounded-lg cursor-pointer bg-white! shadow-sm!'
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
                        className=" rounded-none pl-0 cursor-pointer"
                        items={antMenuItems}
                    />
                </Sider>
                <Content className="p-4 bg-white! h-[calc(100dvh-120px)] overflow-y-auto">
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default ProtectedCard