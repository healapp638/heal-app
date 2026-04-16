'use client'

import {
    FadeIn,
    SlideIn,
    ScaleIn,
    StaggerChildren,
    HoverScale,
    AnimatedCounter,
    ProgressBar,
} from '@/components/animations'
import { Button } from 'antd'

export default function AnimationDemo() {
    return (
        <div className="min-h-screen p-8 space-y-16">
            <div className="max-w-4xl mx-auto">
                <FadeIn>
                    <h1 className="text-4xl font-bold text-center mb-4">
                        Animation Components Demo
                    </h1>
                    <p className="text-center text-muted-foreground">
                        Scroll down to see all animations in action
                    </p>
                </FadeIn>

                {/* FadeIn Demo */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">FadeIn Component</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FadeIn direction="up" delay={0}>
                            <div className="p-6 bg-card rounded-lg border">
                                <h3 className="font-semibold">Fade Up</h3>
                                <p className="text-sm text-muted-foreground">
                                    Slides up while fading in
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn direction="down" delay={0.1}>
                            <div className="p-6 bg-card rounded-lg border">
                                <h3 className="font-semibold">Fade Down</h3>
                                <p className="text-sm text-muted-foreground">
                                    Slides down while fading in
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn direction="left" delay={0.2}>
                            <div className="p-6 bg-card rounded-lg border">
                                <h3 className="font-semibold">Fade Left</h3>
                                <p className="text-sm text-muted-foreground">
                                    Slides from left while fading in
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* SlideIn Demo */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">SlideIn Component</h2>
                    <div className="space-y-4">
                        <SlideIn direction="left">
                            <div className="p-6 bg-primary/10 rounded-lg">
                                <h3 className="font-semibold">Slide from Left</h3>
                            </div>
                        </SlideIn>
                        <SlideIn direction="right">
                            <div className="p-6 bg-primary/10 rounded-lg">
                                <h3 className="font-semibold">Slide from Right</h3>
                            </div>
                        </SlideIn>
                    </div>
                </section>

                {/* ScaleIn Demo */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">ScaleIn Component</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <ScaleIn key={i} delay={i * 0.1}>
                                <div className="aspect-square bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                                    {i}
                                </div>
                            </ScaleIn>
                        ))}
                    </div>
                </section>

                {/* StaggerChildren Demo */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">StaggerChildren Component</h2>
                    <StaggerChildren staggerDelay={0.1}>
                        {['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'].map(
                            (feature, i) => (
                                <div
                                    key={i}
                                    className="p-4 bg-card rounded-lg border mb-3"
                                >
                                    <h3 className="font-semibold">{feature}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        This item animates with a stagger delay
                                    </p>
                                </div>
                            )
                        )}
                    </StaggerChildren>
                </section>

                {/* HoverScale Demo */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">HoverScale Component</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <HoverScale>
                            <Button type="primary" size="large" block>
                                Hover Me
                            </Button>
                        </HoverScale>
                        <HoverScale scale={1.1}>
                            <Button size="large" block>
                                Scale 1.1x
                            </Button>
                        </HoverScale>
                        <HoverScale scale={1.15}>
                            <div className="p-6 bg-card rounded-lg border text-center cursor-pointer">
                                <p className="font-semibold">Card</p>
                            </div>
                        </HoverScale>
                        <HoverScale>
                            <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
                        </HoverScale>
                    </div>
                </section>

                {/* AnimatedCounter Demo */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">AnimatedCounter Component</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FadeIn delay={0}>
                            <div className="text-center p-6 bg-card rounded-lg border">
                                <AnimatedCounter
                                    to={1000}
                                    duration={2}
                                    className="text-4xl font-bold text-primary"
                                />
                                <p className="text-sm text-muted-foreground mt-2">
                                    Happy Customers
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <div className="text-center p-6 bg-card rounded-lg border">
                                <AnimatedCounter
                                    to={50}
                                    duration={2}
                                    delay={0.2}
                                    className="text-4xl font-bold text-primary"
                                />
                                <p className="text-sm text-muted-foreground mt-2">
                                    Projects Completed
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="text-center p-6 bg-card rounded-lg border">
                                <AnimatedCounter
                                    to={99}
                                    duration={2}
                                    delay={0.4}
                                    className="text-4xl font-bold text-primary"
                                />
                                <p className="text-sm text-muted-foreground mt-2">
                                    Satisfaction Rate
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* ProgressBar Demo */}
                <section className="mt-16 mb-16">
                    <h2 className="text-2xl font-bold mb-6">ProgressBar Component</h2>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">React</span>
                                <span className="text-sm text-muted-foreground">90%</span>
                            </div>
                            <ProgressBar progress={90} />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">TypeScript</span>
                                <span className="text-sm text-muted-foreground">85%</span>
                            </div>
                            <ProgressBar progress={85} color="bg-blue-500" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Next.js</span>
                                <span className="text-sm text-muted-foreground">95%</span>
                            </div>
                            <ProgressBar progress={95} color="bg-green-500" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
