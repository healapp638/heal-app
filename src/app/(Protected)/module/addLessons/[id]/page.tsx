import { generateSEO } from "@/lib/seo"
import AddLessons from "./addLessons";

export const metadata = generateSEO({
  title: "Add Lessons",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/module/addLessons",
  keywords: ["Heal", "Lessons", "Technology Company"],
});


// SERVER COMPONENT
export default function AddLessonPage() {
  return <AddLessons />
}
