import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/posts/rich-text";
import { PostCard } from "@/components/posts/post-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContentfulImage } from "@/components/ui/contentful-image";
import { DateComponent } from "@/components/ui/date-component";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/contentful/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Entry not found" };
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.date,
      authors: [post.author.name],
      images: post.coverImage ? [post.coverImage.url] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);

  return (
    <article className="pt-12 pb-24 sm:pt-16 sm:pb-32">
      <header className="shell">
        <Reveal>
          <Link
            href="/posts"
            className="link-underline text-muted-foreground hover:text-ink inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.14em] uppercase"
          >
            <ArrowLeft className="size-3.5" />
            All entries
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
            <span className="text-accent">Journal</span>
            <span aria-hidden className="bg-border-strong size-0.5 rounded-full" />
            <DateComponent dateString={post.date} className="text-muted-foreground" />
            <span aria-hidden className="bg-border-strong size-0.5 rounded-full" />
            <span className="text-muted-foreground">{post.readingMinutes} min read</span>
          </div>

          <h1 className="text-display text-ink mt-6 max-w-[20ch]">{post.title}</h1>

          {post.excerpt ? (
            <p className="text-ink-soft mt-6 max-w-2xl text-[1.125rem] leading-relaxed text-pretty">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Avatar name={post.author.name} picture={post.author.picture?.url} size="lg" />
              <div>
                <p className="font-serif text-[1.05rem] tracking-[-0.01em]">{post.author.name}</p>
                {post.author.role ? (
                  <p className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
                    {post.author.role}
                  </p>
                ) : null}
              </div>
            </div>

            {post.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="accent">{tag}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Reveal>
      </header>

      {post.coverImage ? (
        <Reveal delay={0.1} className="shell mt-12 sm:mt-16">
          <div className="border-border bg-muted overflow-hidden rounded-[var(--radius-lg)] border">
            <ContentfulImage
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              width={post.coverImage.width}
              height={post.coverImage.height}
              renderedWidth={1600}
              quality={74}
              loading="eager"
              fetchPriority="high"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </Reveal>
      ) : null}

      <Separator className="shell mt-14 sm:mt-20" />

      <div className="shell mt-14 sm:mt-20">
        <Reveal>
          {post.body ? (
            <RichText document={post.body} />
          ) : (
            <p className="text-ink-soft text-[1.0625rem] leading-relaxed">
              This entry has no body content yet. The excerpt above is all there is for now.
            </p>
          )}
        </Reveal>
      </div>

      {related.length > 0 ? (
        <section className="shell mt-24 sm:mt-32">
          <Reveal className="border-border flex items-baseline justify-between gap-6 border-t pt-8">
            <p className="eyebrow">Keep reading</p>
            <Link
              href="/posts"
              className="link-underline text-ink-soft hover:text-ink font-mono text-[0.6875rem] tracking-[0.14em] uppercase"
            >
              All entries
              <ArrowUpRight className="ml-1 inline size-3.5" />
            </Link>
          </Reveal>

          <ul className="mt-10 grid grid-cols-1 gap-6 sm:gap-7 lg:grid-cols-3">
            {related.map((item, index) => (
              <li key={item.id} className="h-full">
                <PostCard post={item} index={index} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

export const revalidate = 60;
