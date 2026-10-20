import Link from "next/link";
import { Container } from "@/components/ui/container";
import { DraftContentNotice } from "@/components/information/draft-content-notice";

export function InformationHero({ eyebrow, title, introduction, notice }: { eyebrow: string; title: string; introduction: string; notice?: React.ReactNode }) {
  return (
    <header className="information-hero">
      <Container>
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-current="page">{title}</span></nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="information-hero__intro">{introduction}</p>
        <DraftContentNotice>{notice}</DraftContentNotice>
      </Container>
    </header>
  );
}
