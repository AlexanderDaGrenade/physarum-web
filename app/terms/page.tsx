import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <p>These terms cover your use of this website. Client engagements are governed by a separate written agreement.</p>
      <h2>Content</h2>
      <p>The content on this site is provided for general information. Case studies describe past work; results depend on each project.</p>
      <h2>Intellectual property</h2>
      <p>The Physarum name, logo and site content belong to Physarum and may not be reused without permission.</p>
      <h2>Liability</h2>
      <p>The site is provided as is. To the extent the law allows, we are not liable for losses arising from its use.</p>
      <h2>Changes</h2>
      <p>We may update these terms; the current version will always be on this page.</p>
    </LegalPage>
  );
}
