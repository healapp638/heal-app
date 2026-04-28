import { generateSEO } from "@/lib/seo"
import PrivacyPolicy from "./privacypolicy";

export const metadata = generateSEO({
  title: "Privacy Policy",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/privacypolicy",
  keywords: ["Heal", "Privacy Policy", "Technology Company"],
});


// SERVER COMPONENT
export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />
}
