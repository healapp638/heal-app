import { generateSEO } from "@/lib/seo"
import FAQ from "./faq";

export const metadata = generateSEO({
  title: "FAQ",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/faq",
  keywords: ["Heal", "FAQ", "Technology Company"],
});


// SERVER COMPONENT
export default function FAQPage() {
  return <FAQ />
}
