'use client'

import { useState } from 'react'
import { Card, Form, Input, Button, Avatar, Upload, Divider, Row, Col, Typography, Space, Modal } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, CameraOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import logger from '@/utils/logger'
import { AppButton } from '@/components/ui'
import { FadeIn, ScaleIn, HoverScale } from '@/components/animations'
import { useAppQuery } from '@/tanstack/useAppQuery'
import { useAppCache } from '@/tanstack/useAppCache'
import { QUERY_KEYS } from '@/tanstack/keys'

const { Title, Text } = Typography

export default function ProfileClient() {
    const { setCache } = useAppCache()
    const { data: user } = useAppQuery<any>({
        queryKey: [QUERY_KEYS.USER],
        url: 'admin/auth/me',
        options: {
            staleTime: Infinity,
        }
    })
    const [isEditing, setIsEditing] = useState(false)
    const [form] = Form.useForm()
    const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '')

    const handleEdit = () => {
        form.setFieldsValue({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            location: user?.location || '',
            bio: user?.bio || '',
        })
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        form.resetFields()
    }

    const handleSave = async (values: any) => {
        try {
            logger.info('Saving profile', values)

            const updatedUser = {
                ...user,
                ...values,
                avatar: avatarUrl,
            }

            // Update TanStack Query cache using reusable hook
            setCache([QUERY_KEYS.USER], updatedUser)

            Modal.success({
                title: 'Success',
                content: 'Profile updated successfully!',
            })

            setIsEditing(false)
        } catch (error) {
            logger.error('Error saving profile', error)
            Modal.error({
                title: 'Error',
                content: 'Failed to update profile. Please try again.',
            })
        }
    }

    const handleAvatarChange = (info: any) => {
        const file = info.file
        if (file) {
            // In production, you would upload to a server here
            // For now, we'll create a local preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarUrl(e.target?.result as string)
            }
            reader.readAsDataURL(file.originFileObj || file)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <ScaleIn duration={0.5}>
                <Card className="shadow-lg">
                    {/* Header Section */}
                    <FadeIn delay={0.2}>
                        <div className="text-center mb-8">
                            <div className="relative inline-block">
                                <Avatar
                                    size={120}
                                    src={avatarUrl || undefined}
                                    icon={!avatarUrl && <UserOutlined />}
                                    className="border-4 border-primary/20"
                                />
                                {isEditing && (
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                        onChange={handleAvatarChange}
                                        accept="image/*"
                                    >
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<CameraOutlined />}
                                            className="absolute bottom-0 right-0"
                                            size="small"
                                        />
                                    </Upload>
                                )}
                            </div>

                            {!isEditing && (
                                <>
                                    <Title level={2} className="mt-4 mb-2">
                                        {user?.name || 'User Name'}
                                    </Title>
                                    <Text type="secondary" className="text-base">
                                        {user?.email || 'user@example.com'}
                                    </Text>
                                </>
                            )}
                        </div>
                    </FadeIn>

                    <Divider />

                    {/* Profile Information */}
                    {!isEditing ? (
                        <FadeIn delay={0.3}>
                            <div className="space-y-6">
                                <Row gutter={[24, 24]}>
                                    <Col xs={24} md={12}>
                                        <Space orientation="vertical" size="small" className="w-full">
                                            <Text type="secondary" className="text-xs uppercase">
                                                <MailOutlined className="mr-2" />
                                                Email
                                            </Text>
                                            <Text strong className="text-base">
                                                {user?.email || 'Not provided'}
                                            </Text>
                                        </Space>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Space orientation="vertical" size="small" className="w-full">
                                            <Text type="secondary" className="text-xs uppercase">
                                                <PhoneOutlined className="mr-2" />
                                                Phone
                                            </Text>
                                            <Text strong className="text-base">
                                                {user?.phone || 'Not provided'}
                                            </Text>
                                        </Space>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Space orientation="vertical" size="small" className="w-full">
                                            <Text type="secondary" className="text-xs uppercase">
                                                <EnvironmentOutlined className="mr-2" />
                                                Location
                                            </Text>
                                            <Text strong className="text-base">
                                                {user?.location || 'Not provided'}
                                            </Text>
                                        </Space>
                                    </Col>

                                    <Col xs={24}>
                                        <Space orientation="vertical" size="small" className="w-full">
                                            <Text type="secondary" className="text-xs uppercase">
                                                Bio
                                            </Text>
                                            <Text className="text-base">
                                                {user?.bio || 'No bio added yet.'}
                                            </Text>
                                        </Space>
                                    </Col>
                                </Row>

                                <div className="flex justify-center mt-8">
                                    <HoverScale>
                                        <AppButton
                                            type="primary"
                                            icon={<EditOutlined />}
                                            onClick={handleEdit}
                                            size="large"
                                        >
                                            Edit Profile
                                        </AppButton>
                                    </HoverScale>
                                </div>
                            </div>
                        </FadeIn>
                    ) : (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSave}
                            className="space-y-4"
                        >
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Full Name"
                                        name="name"
                                        rules={[{ required: true, message: 'Please enter your name' }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Enter your name" size="large" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' },
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined />} placeholder="Enter your email" size="large" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Phone"
                                        name="phone"
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="Enter your phone" size="large" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Location"
                                        name="location"
                                    >
                                        <Input prefix={<EnvironmentOutlined />} placeholder="Enter your location" size="large" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        label="Bio"
                                        name="bio"
                                    >
                                        <Input.TextArea
                                            placeholder="Tell us about yourself"
                                            rows={4}
                                            maxLength={500}
                                            showCount
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className="flex justify-center gap-4 mt-6">
                                <Button
                                    icon={<CloseOutlined />}
                                    onClick={handleCancel}
                                    size="large"
                                >
                                    Cancel
                                </Button>
                                <AppButton
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    size="large"
                                >
                                    Save Changes
                                </AppButton>
                            </div>
                        </Form>
                    )}
                </Card>
            </ScaleIn>
        </div>
    )
}
