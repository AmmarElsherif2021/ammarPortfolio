type Props = {
  dateString?: string | null;
};

export function DateFormatter({ dateString }: Props) {
  if (!dateString) {
    return <time>—</time>;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return <time>—</time>;
  }

  const formatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  return <time dateTime={dateString}>{formatted}</time>;
}

export default DateFormatter;