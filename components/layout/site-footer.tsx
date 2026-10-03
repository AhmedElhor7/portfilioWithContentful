import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Separator } from "@/components/ui/separator";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email", href: "mailto:hello@example.com" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t">
      <div className="shell py-14">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr]">
          <Reveal direction="up">
            <p className="font-serif max-w-sm text-[1.75rem] leading-[1.15] tracking-[-0.025em] text-balance">
              Let&rsquo;s make something <span className="wonky text-accent italic">worth reading</span>.
            </p>
            <Link
              href="/#contact"
              className="link-underline text-ink mt-5 inline-flex items-center gap-1.5 font-mono text-[0.75rem] tracking-[0.12em] uppercase"
            >
              Start a conversation
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.label === "Email" ? undefined : "_blank"}
                    rel={social.label === "Email" ? undefined : "noreferrer noopener"}
                    className="link-underline text-ink-soft hover:text-ink font-mono text-[0.8125rem] tracking-[0.06em]"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Separator className="my-10" />

        <div className="text-muted-foreground flex flex-col gap-2 font-mono text-[0.6875rem] tracking-[0.1em] uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Ada Whitfield</p>
          <p>Built with Next.js &amp; motion</p>
        </div>
      </div>
    </footer>
  );
}
