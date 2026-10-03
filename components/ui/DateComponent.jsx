import { formatDate } from "@/lib/utilss";

export default function DateComponent({ dateString, options, ...rest }) {
  return (
    <time dateTime={dateString} {...rest}>
      {formatDate(dateString, options)}
    </time>
  );
}
