'use client';
import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

// ─── Variants ────────────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = (delayChildren = 0.08, staggerChildren = 0.1): Variants => ({
  hidden: {},
  show:   { transition: { delayChildren, staggerChildren } },
});

// ─── Reusable Components ─────────────────────────────────────────────────────

interface Props extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}

/** Fade + slide up on scroll into view */
export function FadeUp({ children, delay = 0, className, once = true, ...rest }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      transition={{ delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Simple fade-in on scroll into view */
export function FadeIn({ children, delay = 0, className, once = true, ...rest }: Props) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      transition={{ delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Fade + slide up, triggered immediately (for hero content) */
export function HeroFadeUp({ children, delay = 0, className, ...rest }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Fade down immediately (for navbars) */
export function HeroFadeDown({ children, delay = 0, className, ...rest }: Props) {
  return (
    <motion.div
      variants={fadeDown}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Stagger wrapper — children animate in sequence on scroll */
export function StaggerContainer({
  children,
  className,
  delayChildren = 0.08,
  staggerChildren = 0.12,
  once = true,
  ...rest
}: Props & { delayChildren?: number; staggerChildren?: number }) {
  return (
    <motion.div
      variants={stagger(delayChildren, staggerChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Card child — use inside StaggerContainer */
export function StaggerItem({ children, className, ...rest }: Props) {
  return (
    <motion.div variants={fadeUp} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
