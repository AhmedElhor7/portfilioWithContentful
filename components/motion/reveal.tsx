"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: Direction;
  blur?: boolean;
  once?: boolean;
  as?: "div" | "section" | "li" | "article" | "span" | "header" | "footer";
};

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
  none: {},
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  distance = 18,
  direction = "up",
  blur = true,
  once = true,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  const shift = offset[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: blur ? "blur(6px)" : "blur(0px)",
      ...(shift.x ? { x: shift.x * distance } : {}),
      ...(shift.y ? { y: shift.y * distance } : {}),
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -12% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

type StaggerProps = {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: "div" | "ul" | "section" | "ol";
};

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  once = true,
  as = "div",
}: StaggerProps) {
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = {
  children?: React.ReactNode;
  className?: string;
  distance?: number;
  as?: "div" | "li" | "article";
};

export function StaggerItem({ children, className, distance = 20, as = "div" }: StaggerItemProps) {
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: distance, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
