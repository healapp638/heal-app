import { generateSEO } from "@/lib/seo"
import AddSubModule from "./addsubModule";

export const metadata = generateSEO({
    title: "Add SubModule",
    description: "Learn how Heal builds scalable, future-ready digital solutions.",
    path: "/module/subModule",
    keywords: ["Heal", "SubModule", "Technology Company"],
});


// SERVER COMPONENT
export default function AddSubModulePage() {
  return <AddSubModule />
}
