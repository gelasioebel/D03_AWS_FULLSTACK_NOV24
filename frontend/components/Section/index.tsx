import "./styles.css";

type SectionProps = {
  className?: string;
  children: React.ReactNode;
};

export function Section({ children, className }: SectionProps) {
  return <section className={`section ${className}`}>{children}</section>;
}
