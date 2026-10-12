"use server";

import { redirect } from "next/navigation";
import { budgetRanges, families } from "@/lib/services";

export type ContactState = { error?: string; fields?: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitBrief(_prev: ContactState, form: FormData): Promise<ContactState> {
  const fields = {
    name: String(form.get("name") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    family: String(form.get("family") ?? ""),
    budget: String(form.get("budget") ?? ""),
    message: String(form.get("message") ?? "").trim(),
  };

  // Honeypot: real visitors never see this field.
  if (form.get("company_website")) redirect("/contact/thanks");

  if (!fields.name || fields.name.length > 120) return { error: "Please enter your name.", fields };
  if (!EMAIL.test(fields.email) || fields.email.length > 200) return { error: "Please enter a valid email address.", fields };
  if (!families.some((f) => f.slug === fields.family)) return { error: "Please choose what you need help with.", fields };
  if (!(budgetRanges as readonly string[]).includes(fields.budget)) return { error: "Please choose a budget range.", fields };
  if (fields.message.length < 10 || fields.message.length > 5000)
    return { error: "Please tell us a little about the project (at least 10 characters).", fields };

  const portal = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;

  if (!portal || !formId) {
    if (process.env.NODE_ENV === "production") {
      console.error("Contact form submitted but HUBSPOT_PORTAL_ID / HUBSPOT_FORM_ID are not set.");
      return { error: "Our form is temporarily unavailable. Please email us instead.", fields };
    }
    console.info("[contact] HubSpot not configured; dev submission:", fields);
    redirect("/contact/thanks");
  }

  const [first, ...rest] = fields.name.split(/\s+/);
  const familyName = families.find((f) => f.slug === fields.family)?.name ?? fields.family;
  const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${formId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: [
        { name: "firstname", value: first },
        { name: "lastname", value: rest.join(" ") },
        { name: "email", value: fields.email },
        { name: "message", value: `[${familyName} · ${fields.budget}]\n\n${fields.message}` },
      ],
      context: { pageUri: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/contact`, pageName: "Contact" },
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error("[contact] HubSpot submission failed", res?.status, await res?.text().catch(() => ""));
    return { error: "Something went wrong sending your brief. Please try again in a minute.", fields };
  }

  redirect("/contact/thanks");
}
