export default function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <svg className={className}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
}
