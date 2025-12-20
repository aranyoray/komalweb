"use client";

import React, { useRef, useMemo } from 'react';
import { motion, useInView, Variants, Transition } from 'framer-motion';

export interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    ease?: string;
    splitType?: 'chars' | 'words' | 'lines';
    from?: { opacity?: number; y?: number; x?: number; scale?: number; rotate?: number };
    to?: { opacity?: number; y?: number; x?: number; scale?: number; rotate?: number };
    threshold?: number;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    textAlign?: React.CSSProperties['textAlign'];
    onAnimationComplete?: () => void;
    staggerChildren?: number;
    initialDelay?: number; // Delay in seconds before animation starts
}

// Map common GSAP easing names to Framer Motion easing
const getEasing = (ease: string): Transition['ease'] => {
    const easingMap: Record<string, Transition['ease']> = {
        'power1.out': [0.25, 0.46, 0.45, 0.94],
        'power2.out': [0.23, 1, 0.32, 1],
        'power3.out': [0.22, 1, 0.36, 1],
        'power4.out': [0.16, 1, 0.3, 1],
        'power1.in': [0.55, 0.06, 0.68, 0.19],
        'power2.in': [0.55, 0.06, 0.68, 0.19],
        'power3.in': [0.55, 0.06, 0.68, 0.19],
        'power4.in': [0.6, 0.04, 0.98, 0.34],
        'power1.inOut': [0.65, 0.05, 0.36, 1],
        'power2.inOut': [0.65, 0.05, 0.36, 1],
        'power3.inOut': [0.65, 0.05, 0.36, 1],
        'power4.inOut': [0.76, 0, 0.24, 1],
        'ease': [0.25, 0.1, 0.25, 1],
        'easeIn': [0.42, 0, 1, 1],
        'easeOut': [0, 0, 0.58, 1],
        'easeInOut': [0.42, 0, 0.58, 1],
    };
    return easingMap[ease] || easingMap['power3.out'];
};

const SplitText: React.FC<SplitTextProps> = ({
    text,
    className = '',
    delay = 50,
    duration = 0.6,
    ease = 'power3.out',
    splitType = 'chars',
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    tag = 'p',
    textAlign = 'center',
    onAnimationComplete,
    staggerChildren,
    initialDelay = 0,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = useRef<any>(null);
    const isInView = useInView(ref, { once: true, amount: threshold });

    // Calculate stagger from delay (delay is in ms, stagger in seconds)
    const stagger = staggerChildren ?? delay / 1000;

    // Split text based on splitType
    const splitElements = useMemo(() => {
        if (splitType === 'words') {
            return text.split(' ').map((word, i, arr) => ({
                content: word + (i < arr.length - 1 ? '\u00A0' : ''), // Add non-breaking space except for last word
                key: `word-${i}`,
            }));
        } else if (splitType === 'lines') {
            return text.split('\n').map((line, i) => ({
                content: line,
                key: `line-${i}`,
            }));
        } else {
            // chars
            return text.split('').map((char, i) => ({
                content: char === ' ' ? '\u00A0' : char,
                key: `char-${i}`,
            }));
        }
    }, [text, splitType]);

    // Animation variants
    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger,
                delayChildren: initialDelay,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: {
            opacity: from.opacity ?? 0,
            y: from.y ?? 0,
            x: from.x ?? 0,
            scale: from.scale ?? 1,
            rotate: from.rotate ?? 0,
        },
        visible: {
            opacity: to.opacity ?? 1,
            y: to.y ?? 0,
            x: to.x ?? 0,
            scale: to.scale ?? 1,
            rotate: to.rotate ?? 0,
            transition: {
                duration,
                ease: getEasing(ease),
            },
        },
    };

    const style: React.CSSProperties = {
        textAlign,
        display: 'inline-block',
    };

    const Tag = tag;

    return (
        <Tag ref={ref} style={style} className={className}>
            <motion.span
                style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                onAnimationComplete={() => {
                    if (isInView && onAnimationComplete) {
                        onAnimationComplete();
                    }
                }}
            >
                {splitElements.map((element) => (
                    <motion.span
                        key={element.key}
                        variants={itemVariants}
                        style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                    >
                        {element.content}
                    </motion.span>
                ))}
            </motion.span>
        </Tag>
    );
};

export default SplitText;
