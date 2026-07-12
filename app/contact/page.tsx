"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Təşəkkür edirik! Mesajınız qeydə alındı (demo — real email inteqrasiyası üçün Resend/SendGrid qoşula bilər).");
  }

  return (
    <>
      <h1 className="section-title">Əlaqə</h1>
      <form className="form-block" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Ad Soyad</label>
          <input id="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">E-poçt</label>
          <input id="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="subject">Mövzu</label>
          <input id="subject" />
        </div>
        <div className="field">
          <label htmlFor="message">Mesaj</label>
          <textarea id="message" required />
        </div>
        <button className="btn" type="submit">
          Göndər
        </button>
        {status && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)", marginTop: 12 }}>
            {status}
          </p>
        )}
      </form>
    </>
  );
}
