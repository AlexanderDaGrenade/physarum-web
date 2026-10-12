import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>This policy explains what information Physarum collects through this website and how we use it.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Details you submit in our contact form: name, email, the service you’re interested in, budget range and message.</li>
        <li>Booking details if you schedule a call through our scheduling provider.</li>
        <li>Basic technical data our hosting provider logs to keep the site secure and working.</li>
      </ul>
      <h2>How we use it</h2>
      <p>To reply to your enquiry, scope and deliver work you ask us for, and keep records of our business correspondence. We don’t sell your information.</p>
      <h2>Who we share it with</h2>
      <p>Service providers that help us run the business, such as our CRM, scheduling and hosting providers, under their own data-protection terms.</p>
      <h2>Your choices</h2>
      <p>You can ask us to access, correct or delete the information we hold about you by contacting us.</p>
    </LegalPage>
  );
}
