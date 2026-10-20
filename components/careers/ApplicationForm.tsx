"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { careersEmail, cvRules, roles } from "@/lib/careers";

const ENDPOINT = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/apply.php`;
const GENERAL = "General application";

const input =
  "mt-2 w-full rounded-xl border border-line bg-card px-4 py-3 text-fg placeholder:text-muted/70 focus:border-fg focus:outline-none";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function ApplicationForm() {
  const params = useSearchParams();
  const preselected = roles.find((r) => r.slug === params.get("role"))?.title ?? "";
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const cv = data.get("cv");

    if (!get("name")) return setStatus({ kind: "error", message: "Please enter your name." });
    if (!EMAIL.test(get("email"))) return setStatus({ kind: "error", message: "Please enter a valid email address." });
    if (!get("role")) return setStatus({ kind: "error", message: "Please choose the role you’re applying for." });
    if (get("message").length < 20)
      return setStatus({ kind: "error", message: "Please tell us a little about yourself (at least 20 characters)." });
    if (!(cv instanceof File) || cv.size === 0)
      return setStatus({ kind: "error", message: "Please attach your CV (PDF, DOC or DOCX, up to 5 MB)." });
    const ext = cv.name.split(".").pop()?.toLowerCase() ?? "";
    if (!(cvRules.extensions as readonly string[]).includes(ext))
      return setStatus({ kind: "error", message: "Please upload your CV as a PDF, DOC or DOCX file." });
    if (cv.size > cvRules.maxMb * 1024 * 1024)
      return setStatus({ kind: "error", message: `Your CV is too large. Please upload a file up to ${cvRules.maxMb} MB.` });

    setStatus({ kind: "sending" });
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && json?.ok) return setStatus({ kind: "sent" });
      setStatus({
        kind: "error",
        message: json?.error ?? `We couldn’t send your application just now. Please email your CV to ${careersEmail}.`,
      });
    } catch {
      setStatus({ kind: "error", message: `We couldn’t send your application just now. Please email your CV to ${careersEmail}.` });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-3xl border border-line bg-card p-8 md:p-10">
        <span className="block size-3 rounded-full bg-mold" aria-hidden="true" />
        <h3 className="mt-6 text-3xl font-semibold tracking-tight">Application received — thank you.</h3>
        <p className="mt-3 text-muted">
          A real person will read it. If there’s a fit, we’ll be in touch within a week to arrange a short call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 rounded-3xl border border-line bg-card p-6 md:p-10" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm">
          Full name
          <input name="name" required autoComplete="name" className={input} />
        </label>
        <label className="text-sm">
          Email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm">
          Role
          <select name="role" required defaultValue={preselected} className={input}>
            <option value="" disabled>
              Choose a role
            </option>
            {roles.map((r) => (
              <option key={r.slug}>{r.title}</option>
            ))}
            <option>{GENERAL}</option>
          </select>
        </label>
        <label className="text-sm">
          Phone / WhatsApp <span className="text-muted">(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" className={input} />
        </label>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm">
          LinkedIn <span className="text-muted">(optional)</span>
          <input name="linkedin" type="url" placeholder="https://linkedin.com/in/…" className={input} />
        </label>
        <label className="text-sm">
          Portfolio / GitHub <span className="text-muted">(optional)</span>
          <input name="portfolio" type="url" placeholder="https://…" className={input} />
        </label>
      </div>
      <label className="text-sm">
        Tell us about yourself
        <textarea
          name="message"
          required
          rows={5}
          placeholder="What have you built or worked on that you’re proud of? Why this role?"
          className={input}
        />
      </label>
      <label className="text-sm">
        CV
        <input
          name="cv"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="mt-2 block w-full rounded-xl border border-dashed border-line bg-bg px-4 py-4 text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-fg file:px-4 file:py-2 file:text-sm file:font-medium file:text-bg"
        />
        <span className="mt-2 block text-xs text-muted">PDF, DOC or DOCX, up to {cvRules.maxMb} MB.</span>
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Leave this empty
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status.kind === "error" && (
        <p role="alert" className="rounded-xl border border-line bg-bg px-4 py-3 text-sm">
          {status.message}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85 disabled:opacity-50"
        >
          {status.kind === "sending" ? "Sending…" : "Send application"}
        </button>
        <p className="text-sm text-muted">
          Or email your CV to{" "}
          <a href={`mailto:${careersEmail}`} className="text-fg underline underline-offset-4">
            {careersEmail}
          </a>
        </p>
      </div>
    </form>
  );
}
