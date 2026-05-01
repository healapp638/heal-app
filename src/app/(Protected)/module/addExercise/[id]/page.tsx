import { generateSEO } from "@/lib/seo"
import AddExercise from "./addExercise";

export const metadata = generateSEO({
  title: "Add Exercise",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/module/addExercise",
  keywords: ["Heal", "Exercise", "Technology Company"],
});


// SERVER COMPONENT
export default function AddExercisePage() {
  return <AddExercise />
}
