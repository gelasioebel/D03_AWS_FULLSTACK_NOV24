import { LucideIcon } from "lucide-react";

import "./styles.css";

export type StepCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function StepCard({ icon: Icon, title, description }: StepCardProps) {
  return (
    <div className="card">
      <div className="icon-container">
        <Icon className="icon" />
      </div>
      <div className="content">
        <span className="title lato">{title}</span>
        <p className="description raleway">{description}</p>
      </div>
    </div>
  );
}
