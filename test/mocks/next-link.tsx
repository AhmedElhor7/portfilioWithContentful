import * as React from "react";

type MockLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string };
};

/**
 * Minimal stand-in for `next/link` so component tests do not need the App Router
 * runtime. It only keeps the parts the components rely on: the resolved `href`
 * and the forwarded anchor attributes.
 */
export function MockLink({ href, children, ...props }: MockLinkProps) {
  return (
    <a href={typeof href === "string" ? href : (href?.pathname ?? "")} {...props}>
      {children}
    </a>
  );
}
