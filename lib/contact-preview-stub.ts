// Stand-in for app/contact/actions.ts in the static GitHub Pages preview,
// where server actions can't run. The preview contact page never renders the form.
export type ContactState = { error?: string; fields?: Record<string, string> };

export async function submitBrief(...args: [ContactState, FormData]): Promise<ContactState> {
  void args;
  return { error: "The form is disabled in this preview." };
}
