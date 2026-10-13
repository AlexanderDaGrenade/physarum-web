"use client";

import { useActionState } from "react";
import { submitBrief, type ContactState } from "@/app/contact/actions";
import { budgetRanges, families } from "@/lib/services";

const input =
  "mt-2 w-full rounded-xl border border-line bg-card px-4 py-3 text-fg placeholder:text-muted/70 focus:border-fg focus:outline-none";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitBrief, {});
  const f = state.fields ?? {};

  return (
    <form action={action} className="grid gap-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm">
          Name
          <input name="name" required autoComplete="name" defaultValue={f.name} className={input} />
        </label>
        <label className="text-sm">
          Work email
          <input name="email" type="email" required autoComplete="email" defaultValue={f.email} className={input} />
        </label>
      </div>
      <fieldset>
        <legend className="text-sm">What do you need?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {families.map((fam) => (
            <label key={fam.slug} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm has-[:checked]:border-mold">
              <input type="radio" name="family" value={fam.slug} defaultChecked={f.family === fam.slug} required className="accent-[var(--mold)]" />
              {fam.name}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="text-sm">
        Budget
        <select name="budget" required defaultValue={f.budget ?? ""} className={input}>
          <option value="" disabled>
            Choose a range
          </option>
          {budgetRanges.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Tell us about the project
        <textarea name="message" required rows={6} defaultValue={f.message} placeholder="Where are you trying to get to, and what’s in the way?" className={input} />
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Leave this empty
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl border border-line bg-card px-4 py-3 text-sm">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="justify-self-start rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85 disabled:opacity-50">
        {pending ? "Sending…" : "Send brief"}
      </button>
    </form>
  );
}
