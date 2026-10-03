import ContentfulImage from "./ContentfulImage";

export default function Avatar({ name, picture }) {
  const pictureUrl = picture?.fields?.file?.url;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-9 w-9 overflow-hidden rounded-full border border-stone-200 bg-stone-100">
        {pictureUrl && (
          <ContentfulImage
            src={pictureUrl}
            width={40}
            height={40}
            alt={name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="text-sm font-medium text-stone-800">{name}</div>
    </div>
  );
}
