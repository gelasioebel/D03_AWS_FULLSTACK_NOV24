import { DeveloperCard } from "../../components/DeveloperCard";
import { Developer } from "../../types/developer";
import "./style.css";

const developers: Developer[] = [
  {
    name: "Thomas Henrique de Souza Santos",
    avatar: "https://github.com/thethoomm.png",
    role: "Fullstack Developer",
    personalDescription:
      "Node.js ecosystem (Next.js, Nest.js, Vue.js) and Golang.",
  },
  {
    name: "Gelasio Ebel Junior",
    avatar: "https://github.com/gelasioebel.png",
    role: "Backend Developer",
    personalDescription: "Forging my career path in technology",
  },
  {
    name: "Adriann Postigo Paranhos",
    avatar: "https://github.com/adriannparanhos.png",
    role: "Fullstack Developer",
    personalDescription: "Gosto de codar",
  },
  {
    name: "Rodrigo Soares Prazeres",
    avatar: "https://github.com/RodrigoPrazeres.png",
    role: "Frontend Developer",
    personalDescription: "Forging my career path in technology",
  },
];

export default function AboutUs() {
  return (
    <div className="about-us-page">
      <div className="about-us-developers">
        {developers.map((developer, index) => (
          <DeveloperCard key={index} developer={developer} />
        ))}
      </div>
    </div>
  );
}
