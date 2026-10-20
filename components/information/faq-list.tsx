import type { faqGroups } from "@/lib/content/information-pages";

type FaqGroups = typeof faqGroups;

export function FaqList({ groups }: { groups: FaqGroups }) {
  return (
    <div className="full-faq-groups">
      {groups.map((group) => (
        <section key={group.title} aria-labelledby={`faq-${group.title.toLowerCase().replaceAll(" ", "-")}`}>
          <h2 id={`faq-${group.title.toLowerCase().replaceAll(" ", "-")}`}>{group.title}</h2>
          <div className="full-faq-list">
            {group.items.map((item) => (
              <details className="full-faq-item" key={item.question}>
                <summary><span>{item.question}</span><span aria-hidden="true">+</span></summary>
                <div className="full-faq-answer">
                  <span className={`content-status content-status--${item.status}`}>{item.status === "pending-owner-approval" ? "Pending owner approval" : "Current development status"}</span>
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
