import { generateSEO } from "@/lib/seo"
import AddModule from "./addModule";

export const metadata = generateSEO({
  title: "Add Module",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/module/addModule",
  keywords: ["Heal", "Module", "Technology Company"],
});


// SERVER COMPONENT
export default function AddModulePage() {
  return <AddModule />
}
