export function DraftContentNotice({ children = "This page is a development draft awaiting owner review. It is not a finalized customer policy or commitment." }: { children?: React.ReactNode }) {
  return (
    <aside className="draft-content-notice" aria-label="Development draft notice">
      <strong>Development draft</strong>
      <p>{children}</p>
    </aside>
  );
}
