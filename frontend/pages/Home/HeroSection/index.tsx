import { Button } from "../../../components/Button";
import './styles.css'

export function HeroSection() {
  return (
    <section className="hero-section">
      <img
        className="left-plant"
        src="/images/left-plant.png"
        alt="Left Plant"
      />
      <div className="hero-content">
        <div className="hero-love">
          <div className="love-dash" />
          <span className="love-text pacifico">Love for Nature</span>
        </div>
        <div className="hero-text">
          <h2 className="hero-title eb-garamond">
            Discover your <span className="text-green">green</span> side
          </h2>
          <p className="hero-subtitle raleway">
            We are your one-stop destination for all things green and growing.
            Our website offers a wide array of stunning plants, ranging from
            vibrant flowers to lush indoor foliage, allowing you to create your
            very own green oasis.
          </p>
        </div>
        <Button label="Shop now" />
      </div>
      <img className="hero-plant" src="/images/main-plant.png" alt="Garden" />
    </section>
  );
}
