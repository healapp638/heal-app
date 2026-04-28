import { generateSEO } from "@/lib/seo"
import TermsAndCondition from "./termsandCondition";

export const metadata = generateSEO({
  title: "Terms And Condition",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/termsandcondition",
  keywords: ["Heal", "Terms And Condition", "Technology Company"],
});


// SERVER COMPONENT
export default function TermsAndConditionPage() {
  return <TermsAndCondition />
}
