import PostCard from "@/components/posts/postCard";
import { client } from "@/lib/contentful/client";

type PostEntry = {
  fields: {
    slug: string;
  };
};

export default function Posts({ posts = [] as PostEntry[] }) {
  return (
    <section className="min-h-screen bg-[#f7f3ee] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-stone-500">
            Journal
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-5xl">
            Latest posts
          </h1>
        </div>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post?.fields?.slug} post={post} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export const getStaticProps = async () => {
  const response = await client.getEntries({ content_type: "post" });

  return {
    props: {
      posts: response.items,
    },
    revalidate: 60,
  };
};
