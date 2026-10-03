import * as React from "react";
import { cn } from "@/lib/utils";
import { formatDate, toISODate } from "@/lib/format";

type DateComponentProps = React.ComponentProps<"time"> & {
  dateString?: string | Date | null;
  options?: Intl.DateTimeFormatOptions;
  prefix?: string;
};

function DateComponent({ dateString, options, prefix, className, ...props }: DateComponentProps) {
  const iso = toISODate(dateString);
  const label = formatDate(dateString, options);

  if (!label) return null;

  return (
    <time dateTime={iso} className={cn("whitespace-nowrap", className)} {...props}>
      {prefix ? `${prefix} ` : null}
      {label}
    </time>
  );
}

export { DateComponent };
