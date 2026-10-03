import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">404</span>
          <span aria-hidden className="bg-border-strong h-px w-6" />
          Not found
        </p>
        <h1 className="text-display text-ink mt-6 max-w-[16ch]">
          This page went <span className="wonky text-accent italic">off the record</span>.
        </h1>
        <p className="text-ink-soft mt-6 max-w-md text-[1.0625rem] leading-relaxed">
          The address may have changed, or the entry was never published. The journal is a good
          place to pick up the thread.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button size="lg" render={<Link href="/" />}>
            Back to index
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/posts" />}>
            Read the journal
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
