import "./styles.css";

type ButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({ label, disabled, onClick }: ButtonProps) {
  return (
    <button className="container raleway" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
