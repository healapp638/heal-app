"use client";

import Antd from "@/ui/antd";
import logger from "@/utils/logger";

export default function ContactPage() {
    return (
        <div className="">
            {/* Header */}
            <div className="text-center mb-14">
                <h1 className="blackText mb-4">Get in Touch</h1>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                    Have questions, feedback, or need support?
                    Our team is here to help you every step of the way.
                </p>
            </div>

            {/* Grid using AntD */}
            <Antd.Row gutter={[32, 32]}>
                {/* Contact Info */}
                <Antd.Col xs={24} lg={12}>
                    <div className="bg-card h-full w-full p-4 rounded-2xl" >
                        <h2 className="mb-4">Contact Information</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Reach out to us through any of the following channels. We
                            typically respond within one business day.
                        </p>

                        <div className="space-y-5 text-sm">
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-muted-foreground">
                                    support@solariotech.com
                                </p>
                            </div>

                            <div>
                                <p className="font-medium">Business Hours</p>
                                <p className="text-muted-foreground">
                                    Monday – Friday, 9:00 AM – 6:00 PM
                                </p>
                            </div>

                            <div>
                                <p className="font-medium">Location</p>
                                <p className="text-muted-foreground">
                                    Global · Remote-First Team
                                </p>
                            </div>
                        </div>
                    </div>
                </Antd.Col>

                {/* Contact Form */}
                <Antd.Col xs={24} lg={12}>
                    <div className="bg-card h-full w-full p-4 rounded-2xl" >
                        <h2 className="mb-6">Send Us a Message</h2>

                        <Antd.Form
                            layout="vertical"
                            onFinish={(values) => {
                                logger.log("Contact Form Data:", values);
                            }}
                        >
                            <Antd.Form.Item
                                label="Full Name"
                                name="name"
                                rules={[
                                    { required: true, message: "Please enter your name" },
                                ]}
                            >
                                <Antd.Input placeholder="Your name" />
                            </Antd.Form.Item>

                            <Antd.Form.Item
                                label="Email Address"
                                name="email"
                                rules={[
                                    { required: true, message: "Please enter your email" },
                                    { type: "email", message: "Enter a valid email" },
                                ]}
                            >
                                <Antd.Input placeholder="you@example.com" />
                            </Antd.Form.Item>

                            <Antd.Form.Item
                                label="Message"
                                name="message"
                                rules={[
                                    { required: true, message: "Please enter your message" },
                                ]}
                            >
                                <Antd.Input.TextArea rows={4} placeholder="How can we help you?" />
                            </Antd.Form.Item>

                            <Antd.Form.Item className="mb-0">
                                <Antd.Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full"
                                >
                                    Send Message
                                </Antd.Button>
                            </Antd.Form.Item>
                        </Antd.Form>
                    </div>
                </Antd.Col>
            </Antd.Row>

            {/* Footer Note */}
            <p className="mt-16 text-center text-xs text-muted-foreground">
                By contacting us, you agree to our terms and privacy policy.
            </p>
        </div>
    );
}
