import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function PostsEmptyState() {
  return (
    <Reveal className="border-border bg-card/50 flex flex-col items-center gap-5 rounded-[var(--radius-lg)] border border-dashed px-6 py-20 text-center">
      <span className="border-border text-muted-foreground grid size-12 place-items-center rounded-full border">
        <FileText className="size-5" />
      </span>
      <div className="max-w-sm space-y-2">
        <p className="font-serif text-[1.5rem] tracking-[-0.02em]">Nothing published yet</p>
        <p className="text-ink-soft text-[0.9375rem] leading-relaxed">
          Once entries are published in Contentful they&rsquo;ll appear here automatically.
        </p>
      </div>
      <Button variant="outline" size="sm" render={<Link href="/" />}>
        Back to index
      </Button>
    </Reveal>
  );
}
