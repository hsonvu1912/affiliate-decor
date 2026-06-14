"use client";

import { useState } from "react";

// Presentational newsletter signup. There is no mailing backend in this
// affiliate demo, so submit is handled client-side: it just acknowledges.
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setDone(true);
  }

  if (done) {
    return (
      <p className="text-sm text-mute">
        Cảm ơn bạn — chúng tôi sẽ gửi tuyển tập mới tới <strong className="text-ink">{email}</strong>.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center border-b border-ink">
      <label htmlFor="newsletter-email" className="sr-only">
        Email nhận bản tin
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email của bạn"
        className="w-full bg-transparent py-2 text-sm text-ink placeholder:text-mute focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Đăng ký"
        className="shrink-0 pl-3 text-ink transition-opacity hover:opacity-60"
      >
        →
      </button>
    </form>
  );
}
