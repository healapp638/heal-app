import { generateSEO } from "@/lib/seo"
import AddMcqExercise from "./addMcqExercise";

export const metadata = generateSEO({
  title: "Add MCQ Exercise",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/module/addMcqExercise",
  keywords: ["Heal", "MCQ Exercise", "Technology Company"],
});


// SERVER COMPONENT
export default function AddMcqExercisePage() {
  return <AddMcqExercise />
}
