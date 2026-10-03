import * as React from "react";
import Link from "next/link";
import type {
  Block,
  Document,
  Inline,
  Text,
  TopLevelBlock,
} from "@contentful/rich-text-types";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { ContentfulImage } from "@/components/ui/contentful-image";
import { normalizeImage, type ImageAsset } from "@/lib/contentful/types";

type Node = Block | Inline | TopLevelBlock | Text;

function renderText(node: Text, key?: string): React.ReactNode {
  let content: React.ReactNode = node.value;

  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case MARKS.BOLD:
        content = <strong>{content}</strong>;
        break;
      case MARKS.ITALIC:
        content = <em>{content}</em>;
        break;
      case MARKS.UNDERLINE:
        content = <u>{content}</u>;
        break;
      case MARKS.CODE:
        content = <code>{content}</code>;
        break;
      case MARKS.SUPERSCRIPT:
        content = <sup>{content}</sup>;
        break;
      case MARKS.SUBSCRIPT:
        content = <sub>{content}</sub>;
        break;
      default:
        break;
    }
  }

  return <React.Fragment key={key}>{content}</React.Fragment>;
}

function renderChildren(node: Node): React.ReactNode {
  if ("content" in node && Array.isArray(node.content)) {
    return node.content.map((child, index) => renderNode(child as Node, `${child.nodeType}-${index}`));
  }
  return null;
}

function renderNode(node: Node, key: string): React.ReactNode {
  if (node.nodeType === "text") {
    return renderText(node, key);
  }

  switch (node.nodeType) {
    case BLOCKS.PARAGRAPH: {
      const children = renderChildren(node);
      if (children === null) return null;
      return <p key={node.data?.uri ?? JSON.stringify(node).slice(0, 24)}>{children}</p>;
    }

    case BLOCKS.HEADING_1:
    case BLOCKS.HEADING_2:
    case BLOCKS.HEADING_3:
    case BLOCKS.HEADING_4:
    case BLOCKS.HEADING_5:
    case BLOCKS.HEADING_6: {
      const Tag = `h${node.nodeType.slice(-1)}` as "h2";
      return <Tag key={key}>{renderChildren(node)}</Tag>;
    }

    case BLOCKS.UL_LIST:
      return <ul key={key}>{renderChildren(node)}</ul>;

    case BLOCKS.OL_LIST:
      return <ol key={key}>{renderChildren(node)}</ol>;

    case BLOCKS.LIST_ITEM:
      return <li key={key}>{renderChildren(node)}</li>;

    case BLOCKS.QUOTE:
      return <blockquote key={key}>{renderChildren(node)}</blockquote>;

    case BLOCKS.HR:
      return <hr key={key} />;

    case INLINES.HYPERLINK: {
      const href = (node.data as { uri?: string } | undefined)?.uri ?? "#";
      const isExternal = /^https?:\/\//.test(href);

      if (isExternal) {
        return (
          <a key={key} href={href} target="_blank" rel="noreferrer noopener">
            {renderChildren(node)}
          </a>
        );
      }

      return (
        <Link key={key} href={href}>
          {renderChildren(node)}
        </Link>
      );
    }

    case INLINES.ASSET_HYPERLINK: {
      const asset = normalizeImage(node.data?.target);
      if (!asset) return renderChildren(node);
      return (
        <Link key={key} href={asset.url} target="_blank" rel="noreferrer noopener">
          {renderChildren(node)}
        </Link>
      );
    }

    case INLINES.ENTRY_HYPERLINK:
    case INLINES.EMBEDDED_ENTRY: {
      const target = node.data?.target as { fields?: { slug?: string; title?: string } } | undefined;
      const slug = target?.fields?.slug;
      const title = target?.fields?.title ?? "this piece";

      if (!slug) return <span key={key}>{title}</span>;

      return (
        <Link key={key} href={`/posts/${slug}`}>
          {renderChildren(node) ?? title}
        </Link>
      );
    }

    case BLOCKS.EMBEDDED_ASSET: {
      const asset = normalizeImage(node.data?.target) as ImageAsset | null;
      if (!asset) return null;

      return (
        <figure key={key} className="my-10">
          <ContentfulImage
            src={asset.url}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            renderedWidth={1200}
            className="w-full rounded-xl border"
          />
        </figure>
      );
    }

    default:
      return renderChildren(node);
  }
}

export function RichText({ document }: { document: Document | null }) {
  if (!document?.content?.length) return null;

  return (
    <div className="prose-editorial">
      {document.content.map((node, index) => (
        <React.Fragment key={`${node.nodeType}-${index}`}>{renderNode(node as Node, `${node.nodeType}-${index}`)}</React.Fragment>
      ))}
    </div>
  );
}
