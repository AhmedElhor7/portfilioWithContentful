import Link from "next/link";
import Avatar from "../ui/Avatar";
import DateComponent from "../ui/DateComponent";
import ContentfulImage from "../ui/ContentfulImage";

export default function PostCard({ post }) {
  const { title, slug, excerpt, coverImage, author, date } = post.fields;

  return (
    <li className="group h-full">
      <Link
        href={`/posts/${slug}`}
        aria-label={title}
        className="flex h-full flex-col overflow-hidden rounded-[26px] border border-stone-200/80 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]"
      >
        <div className="relative overflow-hidden bg-stone-200">
          <div className="h-56 w-full sm:h-60">
            <ContentfulImage
              alt={`Cover Image for ${title}`}
              src={coverImage.fields.file.url}
              width={coverImage.fields.file.details.image.width}
              height={coverImage.fields.file.details.image.height}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              <DateComponent dateString={date} />
            </p>
          </div>

          <h3 className="mb-3 text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.04em] text-stone-900">
            {title}
          </h3>

          <p className="mb-5 line-clamp-3 text-[0.97rem] leading-7 text-stone-600">
            {excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
            <Avatar name={author.fields.name} picture={author.fields.picture} />
            <span className="text-sm font-medium text-stone-700">Read article</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
