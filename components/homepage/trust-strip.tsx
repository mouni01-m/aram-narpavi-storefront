import Image from "next/image";
import { Container } from "@/components/ui/container";

const trustPoints = [
  { icon: "/images/icons/natural-ingredients.svg", title: "Natural ingredients", text: "Herbal recipes rooted in everyday routines." },
  { icon: "/images/icons/traditional-recipes.svg", title: "Traditional recipes", text: "Favourites prepared the traditional way." },
  { icon: "/images/icons/quality-care.svg", title: "Quality care", text: "Products presented with clear, honest details." },
];

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Why choose Aram Narpavi Herbals">
      <Container>
        <ul className="trust-strip__list">
          {trustPoints.map((point) => (
            <li className="trust-strip__item" key={point.title}>
              <Image src={point.icon} alt="" width={44} height={44} unoptimized />
              <div>
                <strong>{point.title}</strong>
                <span>{point.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
