"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type CounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
};

export function Counter({ value, suffix = "", prefix = "", label, className }: CounterProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (reducedMotion) {
          setDisplay(value);
          return;
        }

        let start: number | null = null;
        const duration = 1100;

        const tick = (timestamp: number) => {
          if (start === null) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setDisplay(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, reducedMotion]);

  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)}>
      <span className="font-serif text-[2.5rem] leading-none tracking-[-0.03em] tabular-nums">
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
        {label}
      </span>
    </div>
  );
}

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
};

export function Parallax({ children, className, distance = 60 }: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reducedMotion ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
