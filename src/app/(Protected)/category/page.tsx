import { generateSEO } from "@/lib/seo"
import Category from "./category";

export const metadata = generateSEO({
  title: "Category",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/category",
  keywords: ["Heal", "Category", "Technology Company"],
});


// SERVER COMPONENT
export default function CategoryPage() {
  return <Category />
}
