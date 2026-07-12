"use client";

export default function ShareRow({ title }: { title: string }) {
  function copyLink() {
    navigator.clipboard?.writeText(window.location.href);
    alert("Link kopyalandı!");
  }

  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="share-row" style={{ maxWidth: 760, margin: "26px auto" }}>
      <button className="share-btn" onClick={copyLink}>
        Linki kopyala
      </button>
      <a
        className="share-btn"
        href={`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>
      <a
        className="share-btn"
        href={`https://t.me/share/url?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Telegram
      </a>
    </div>
  );
}
