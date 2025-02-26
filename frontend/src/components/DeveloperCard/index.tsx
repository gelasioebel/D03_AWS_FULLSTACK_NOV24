import { Developer } from "../../types/developer";
import { Badge } from "../Badge";
import "./styles.css";

type DeveloperCardProps = {
  developer: Developer;
};

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <div className="developer-card">
      <img
        className="developer-card-avatar"
        src={developer.avatar}
        alt={`${developer.name} Avatar`}
      />
      <main className="developer-card-content">
        <header className="developer-card-header">
          <h1 className="developer-card-name raleway">{developer.name}</h1>
          <Badge title={developer.role}/>
        </header>
        <p className="developer-card-description eb-garamond">
          {developer.personalDescription}
        </p>
      </main>
    </div>
  );
}
