"use client";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body className="global-error-body">
        <main className="error-page">
          <p className="eyebrow">Aram Narpavi Herbals</p>
          <h1>Something went wrong</h1>
          <p>Please try again.</p>
          <button className="button" onClick={retry}>Try again</button>
        </main>
      </body>
    </html>
  );
}
