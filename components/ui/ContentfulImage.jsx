export default function ContentfulImage({
  src,
  width,
  height,
  alt,
  className,
  ...props
}) {
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt || "Content image"}
      className={className || "h-auto w-full object-cover"}
      loading="lazy"
      {...props}
    />
  );
}