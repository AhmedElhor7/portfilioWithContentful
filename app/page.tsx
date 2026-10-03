import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Counter, Parallax } from "@/components/motion/counter";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PostCard } from "@/components/posts/post-card";
import { getFeaturedPosts } from "@/lib/contentful/posts";

const CAPABILITIES = [
  {
    title: "Design systems",
    body: "Token-driven foundations in Tailwind and CSS variables, documented so they survive handoff.",
  },
  {
    title: "Interface engineering",
    body: "Accessible React components on Next.js App Router, with motion that clarifies rather than decorates.",
  },
  {
    title: "Typography & layout",
    body: "Editorial grids, optical sizing, and type scales tuned for long-form reading on any screen.",
  },
  {
    title: "Performance",
    body: "Server components by default, motion payloads kept small, images sized and served from the CDN.",
  },
] as const;

const TIMELINE = [
  {
    period: "2023 — Now",
    role: "Lead Design Engineer",
    org: "Independent practice",
    note: "Design systems and editorial interfaces for small, exacting teams.",
  },
  {
    period: "2021 — 2023",
    role: "Senior Product Designer",
    org: "Northwind Studio",
    note: "Shipped a component library adopted across eleven product surfaces.",
  },
  {
    period: "2019 — 2021",
    role: "Front-end Engineer",
    org: "Halcyon Labs",
    note: "Built data-heavy dashboards and the first version of the design system.",
  },
] as const;

export default async function Home() {
  const posts = await getFeaturedPosts(3);

  return (
    <>
      <section className="shell relative pt-16 pb-20 sm:pt-24 sm:pb-28">
        <p className="eyebrow flex items-center gap-3">
          <span className="bg-accent size-1.5 rounded-full" aria-hidden />
          Available for select work — 2026
        </p>

        <h1 className="text-hero text-ink mt-8 max-w-[16ch]">
          <MaskReveal text="Design that reads" animateOnMount />
          <br />
          <MaskReveal text="before it decorates." delay={0.18} animateOnMount className="wonky text-accent italic" />
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <Reveal delay={0.35}>
            <p className="text-ink-soft max-w-xl text-[1.125rem] leading-relaxed text-pretty">
              I&rsquo;m Ada — a designer-engineer working at the seam between typography and
              engineering. I build calm, considered interfaces where the type does the talking and
              the code stays out of the way.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" render={<Link href="#work" />}>
                Selected work
                <ArrowRight className="size-3.5" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="#contact" />}>
                Get in touch
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.45} direction="left">
            <dl className="border-border divide-border divide-y border-y">
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
                  Focus
                </dt>
                <dd className="font-serif text-[1.05rem] tracking-[-0.01em]">Design systems</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
                  Stack
                </dt>
                <dd className="font-serif text-[1.05rem] tracking-[-0.01em]">Next.js &amp; Tailwind</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
                  Based in
                </dt>
                <dd className="font-serif text-[1.05rem] tracking-[-0.01em]">Lisbon, Portugal</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <Separator />

      <section className="shell py-20 sm:py-28">
        <Stagger className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          <StaggerItem>
            <Counter value={11} suffix="" label="Years shipping" />
          </StaggerItem>
          <StaggerItem>
            <Counter value={38} label="Products launched" />
          </StaggerItem>
          <StaggerItem>
            <Counter value={4} label="Design systems" />
          </StaggerItem>
          <StaggerItem>
            <Counter value={12} label="Talks &amp; writing" />
          </StaggerItem>
        </Stagger>
      </section>

      <section className="shell pb-20 sm:pb-28">
        <SectionHeading
          index="01"
          label="Approach"
          title={
            <>
              Restraint is a feature, <span className="wonky text-accent italic">not a limitation</span>.
            </>
          }
          description="Most interfaces fail because they ask for attention all at once. I work toward the opposite: a small number of strong decisions, executed consistently, and given room to breathe."
        />

        <Stagger className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {CAPABILITIES.map((capability, index) => (
            <StaggerItem key={capability.title} as="article">
              <div className="border-border group border-t pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-accent font-mono text-[0.6875rem] tracking-[0.14em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-[1.45rem] tracking-[-0.022em]">
                    {capability.title}
                  </h3>
                </div>
                <p className="text-ink-soft mt-3 max-w-sm text-[0.975rem] leading-relaxed">
                  {capability.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="shell pb-20 sm:pb-28">
        <SectionHeading
          index="02"
          label="Selected work"
          title="Recent writing"
          description="Notes on typography, motion, and the systems behind interfaces."
        >
          <Button variant="underline" render={<Link href="/posts" />}>
            All entries
            <ArrowUpRight className="size-3.5" />
          </Button>
        </SectionHeading>

        {posts.length > 0 ? (
          <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:gap-7 lg:grid-cols-3" stagger={0.1}>
            {posts.map((post, index) => (
              <StaggerItem key={post.id} as="article">
                <PostCard post={post} index={index} priority={index === 0} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Reveal className="border-border mt-14 rounded-[var(--radius-lg)] border border-dashed px-6 py-16 text-center">
            <p className="font-serif text-[1.35rem] tracking-[-0.02em]">The journal is empty</p>
            <p className="text-ink-soft mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed">
              Connect Contentful and publish a <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em]">
                post
              </code>{" "}
              entry to see it here.
            </p>
            <Button variant="outline" size="sm" className="mt-6" render={<Link href="/posts" />}>
              Visit the journal
            </Button>
          </Reveal>
        )}
      </section>

      <section className="shell pb-20 sm:pb-28">
        <SectionHeading index="03" label="Path" title="Where I&rsquo;ve been" />
        <Stagger className="mt-14 flex flex-col" stagger={0.09}>
          {TIMELINE.map((item) => (
            <StaggerItem key={item.period} as="article">
              <div className="border-border group grid gap-3 border-t py-7 transition-colors duration-500 hover:border-border-strong sm:grid-cols-[10rem_1fr_1.4fr] sm:gap-8">
                <p className="text-muted-foreground font-mono text-[0.75rem] tracking-[0.1em] uppercase">
                  {item.period}
                </p>
                <div>
                  <p className="font-serif text-[1.25rem] tracking-[-0.02em]">{item.role}</p>
                  <p className="text-accent mt-0.5 font-mono text-[0.75rem] tracking-[0.08em]">
                    {item.org}
                  </p>
                </div>
                <p className="text-ink-soft text-[0.975rem] leading-relaxed">{item.note}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="shell pb-20 sm:pb-28">
        <SectionHeading index="04" label="Toolkit" title="What I reach for">
          <ul className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
            {["Next.js", "TypeScript", "Tailwind CSS", "Motion", "React", "Contentful", "Figma", "Storybook"].map(
              (tool) => (
                <li key={tool}>
                  <Badge variant="default">{tool}</Badge>
                </li>
              ),
            )}
          </ul>
        </SectionHeading>
      </section>

      <section id="contact" className="border-border bg-card scroll-mt-24 border-t">
        <Parallax distance={26} className="shell py-24 sm:py-32">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-accent">05</span>
              <span aria-hidden className="bg-border-strong h-px w-6" />
              Contact
            </p>
            <h2 className="text-display text-ink mt-6 max-w-[18ch]">
              Have something precise in mind?{" "}
              <span className="wonky text-accent italic">Let&rsquo;s talk.</span>
            </h2>
            <p className="text-ink-soft mt-6 max-w-lg text-[1.0625rem] leading-relaxed">
              I take on a small number of engagements each year — design systems, editorial builds,
              and interface audits. Reach out and tell me what you&rsquo;re trying to make clearer.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button size="lg" render={<a href="mailto:hello@example.com" />}>
                hello@example.com
              </Button>
              <Button size="lg" variant="outline" render={<a href="https://github.com" target="_blank" rel="noreferrer noopener" />}>
                GitHub profile
                <ArrowUpRight className="size-3.5" />
              </Button>
            </div>
          </Reveal>
        </Parallax>
      </section>
    </>
  );
}

export const revalidate = 60;
