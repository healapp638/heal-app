import { generateSEO } from "@/lib/seo"
import ContactUs from "./contactus";

export const metadata = generateSEO({
  title: "Contact Us",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/contactus",
  keywords: ["Heal", "Privacy Policy", "Technology Company"],
});


// SERVER COMPONENT
export default function ContactUsPage() {
  return <ContactUs />
}
