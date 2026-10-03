import * as React from "react";
import { cn } from "@/lib/utils";

type Fit = "fill" | "thumb" | "scale" | "pad";

type ContentfulImageProps = Omit<React.ComponentProps<"img">, "src" | "width" | "height"> & {
  src: string;
  width?: number;
  height?: number;
  /** Rendered width in CSS pixels; drives the Contentful Image API width param. */
  renderedWidth?: number;
  quality?: number;
  format?: "avif" | "webp" | "jpg" | "png";
  fit?: Fit;
  focalPoint?: string;
};

function isContentfulAsset(src: string): boolean {
  return src.includes("images.ctfassets.net") || src.includes("assets.ctfassets.net");
}

function buildUrl({
  src,
  renderedWidth,
  quality,
  format,
  fit,
  focalPoint,
}: Pick<
  ContentfulImageProps,
  "src" | "renderedWidth" | "quality" | "format" | "fit" | "focalPoint"
>): string {
  if (!isContentfulAsset(src)) return src;

  const [base, existingQuery = ""] = src.split("?");
  const params = new URLSearchParams(existingQuery);

  if (renderedWidth) params.set("w", String(Math.round(renderedWidth)));
  if (quality) params.set("q", String(quality));
  if (format) params.set("fm", format);
  if (fit) params.set("fit", fit);
  if (focalPoint) params.set("f", focalPoint);

  params.set("q", params.get("q") ?? "72");

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

function ContentfulImage({
  src,
  width,
  height,
  renderedWidth,
  quality = 72,
  format = "avif",
  fit = "fill",
  focalPoint,
  alt,
  className,
  loading = "lazy",
  ...props
}: ContentfulImageProps) {
  const responsiveWidths = [480, 768, 1080, 1400, 1920];
  const srcSet = isContentfulAsset(src)
    ? responsiveWidths.map((w) => `${buildUrl({ src, renderedWidth: w, quality, format, fit, focalPoint })} ${w}w`).join(", ")
    : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={buildUrl({ src, renderedWidth: renderedWidth ?? width, quality, format, fit, focalPoint })}
      srcSet={srcSet}
      sizes={props.sizes ?? (srcSet ? "100vw" : undefined)}
      width={width}
      height={height}
      alt={alt ?? ""}
      loading={loading}
      decoding="async"
      className={cn("block", className)}
      {...props}
    />
  );
}

export { ContentfulImage, buildUrl as buildContentfulImageUrl };
