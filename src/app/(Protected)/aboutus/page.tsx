import { generateSEO } from "@/lib/seo"
import AboutUs from "./aboutus";

export const metadata = generateSEO({
  title: "About Us",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/aboutus",
  keywords: ["Heal", "Terms And Condition", "Technology Company"],
});


// SERVER COMPONENT
export default function AboutUsPage() {
  return <AboutUs />
}
