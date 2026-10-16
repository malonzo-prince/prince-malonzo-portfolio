import { cn } from "@/lib/utils";

export function SectionHeading({
  number,
  label,
  title,
  description,
  className,
}: {
  number: string;
  label: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("section-heading", className)}>
      <p className="eyebrow">
        <span>{number}</span>
        <span className="eyebrow-line" />
        {label}
      </p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
