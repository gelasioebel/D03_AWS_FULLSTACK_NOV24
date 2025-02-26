import "./styles.css";

type BadgeProps = {
  title: string;
};

export function Badge({ title }: BadgeProps) {
  return <span className="badge">{title}</span>;
}
