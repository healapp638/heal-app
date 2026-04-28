import { generateSEO } from "@/lib/seo"
import Module from "./module";

export const metadata = generateSEO({
  title: "Module",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/module",
  keywords: ["Heal", "Module", "Technology Company"],
});


// SERVER COMPONENT
export default function ModulePage() {
  return <Module />
}
