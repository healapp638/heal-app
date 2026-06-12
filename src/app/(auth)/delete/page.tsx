import { generateSEO } from "@/lib/seo"
import Delete from "./delete";

export const metadata = generateSEO({
  title: "Delete",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/delete",
  keywords: ["Heal", "Delete", "Technology Company"],
});


// SERVER COMPONENT
export default function DeletePage() {
  return <Delete />
}
