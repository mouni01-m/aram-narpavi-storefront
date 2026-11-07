import Image from "next/image";
import Link from "next/link";
import { concernGroups, getConcern } from "@/lib/content/concerns";

/**
 * Three cards (skin, hair, wellness). Each lists its concerns as links to their product
 * listings, so all eight /concerns/<slug> pages stay one click from the homepage.
 */
export function ConcernGroups() {
  return (
    <ul className="concern-groups">
      {concernGroups.map((group) => {
        const links = group.concernSlugs.map(getConcern).filter((concern) => concern !== undefined);
        return (
          <li key={group.id}>
            <article className="concern-group" aria-labelledby={`concern-group-${group.id}`}>
              <div className="concern-group__media">
                <Image src={group.image.src} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" style={group.image.focus ? { objectPosition: group.image.focus } : undefined} />
              </div>
              <div className="concern-group__body">
                <h3 id={`concern-group-${group.id}`}>{group.title}</h3>
                <p>{group.description}</p>
                <ul className="concern-group__links">
                  {links.map((concern) => (
                    <li key={concern.slug}>
                      <Link href={`/concerns/${concern.slug}`}>
                        {concern.title}
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
