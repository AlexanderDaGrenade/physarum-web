"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { budgetRanges, families } from "@/lib/services";
import { site } from "@/lib/site";

const ENDPOINT = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/contact.php`;

const timelines = ["As soon as possible", "Within 1–3 months", "3+ months", "Flexible"] as const;

const input =
  "mt-2 w-full rounded-xl border border-line bg-card px-4 py-3 text-fg placeholder:text-muted/70 focus:border-fg focus:outline-none";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string; fallback?: string };

/** Pre-filled email with the brief, for when the form can't be sent. */
function mailtoFor(data: FormData) {
  const get = (k: string) => String(data.get(k) ?? "");
  const body = [
    `Name: ${get("name")}`,
    `Email: ${get("email")}`,
    `Company: ${get("company")}`,
    `Service: ${get("category")}`,
    `Budget: ${get("budget")}`,
    `Timeline: ${get("timeline")}`,
    `NDA first: ${data.get("nda") ? "Yes" : "No"}`,
    "",
    get("message"),
  ].join("\n");
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(`Project brief: ${get("category")}`)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const params = useSearchParams();
  const preselected = families.find((f) => f.slug === params.get("service"))?.name;
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    if (!get("name")) return setStatus({ kind: "error", message: "Please enter your name." });
    if (!EMAIL.test(get("email"))) return setStatus({ kind: "error", message: "Please enter a valid email address." });
    if (!get("category")) return setStatus({ kind: "error", message: "Please choose what you need help with." });
    if (!get("budget")) return setStatus({ kind: "error", message: "Please choose a budget range." });
    if (get("message").length < 10)
      return setStatus({ kind: "error", message: "Please tell us a little about the project (at least 10 characters)." });

    setStatus({ kind: "sending" });
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && json?.ok) return setStatus({ kind: "sent" });
      setStatus({
        kind: "error",
        message: json?.error ?? "We couldn’t send your brief just now.",
        fallback: mailtoFor(data),
      });
    } catch {
      setStatus({ kind: "error", message: "We couldn’t send your brief just now.", fallback: mailtoFor(data) });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="self-start rounded-3xl border border-line bg-card p-8 md:p-10">
        <span className="block size-3 rounded-full bg-mold" aria-hidden="true" />
        <h2 className="mt-6 text-3xl font-semibold tracking-tight">Brief received — thank you.</h2>
        <p className="mt-3 text-muted">
          We’ll reply within one business day. If it’s urgent, email{" "}
          <a href={`mailto:${site.contactEmail}`} className="text-fg underline underline-offset-4">
            {site.contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm">
          Name
          <input name="name" required autoComplete="name" className={input} />
        </label>
        <label className="text-sm">
          Work email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
      </div>
      <label className="text-sm">
        Company <span className="text-muted">(optional)</span>
        <input name="company" autoComplete="organization" className={input} />
      </label>
      <fieldset>
        <legend className="text-sm">What do you need?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {families.map((fam) => (
            <label
              key={fam.slug}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm has-[:checked]:border-mold"
            >
              <input
                type="radio"
                name="category"
                value={fam.name}
                defaultChecked={fam.name === preselected}
                required
                className="accent-[var(--mold)]"
              />
              {fam.name}
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm has-[:checked]:border-mold">
            <input type="radio" name="category" value="Not sure yet" className="accent-[var(--mold)]" />
            Not sure yet
          </label>
        </div>
      </fieldset>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm">
          Budget
          <select name="budget" required defaultValue="" className={input}>
            <option value="" disabled>
              Choose a range
            </option>
            {budgetRanges.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Timeline <span className="text-muted">(optional)</span>
          <select name="timeline" defaultValue="" className={input}>
            <option value="">Choose a timeline</option>
            {timelines.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="text-sm">
        Tell us about the project
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Where are you trying to get to, and what’s in the way?"
          className={input}
        />
      </label>
      <label className="flex items-center gap-3 text-sm text-muted">
        <input type="checkbox" name="nda" value="yes" className="size-4 accent-[var(--mold)]" />
        I’d like an NDA in place before sharing details
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Leave this empty
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status.kind === "error" && (
        <div role="alert" className="rounded-xl border border-line bg-card px-4 py-3 text-sm">
          {status.message}
          {status.fallback && (
            <>
              {" "}
              <a href={status.fallback} className="font-medium text-fg underline underline-offset-4">
                Send it by email instead
              </a>{" "}
              — your answers are already filled in.
            </>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="justify-self-start rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85 disabled:opacity-50"
      >
        {status.kind === "sending" ? "Sending…" : "Send brief"}
      </button>
    </form>
  );
}
