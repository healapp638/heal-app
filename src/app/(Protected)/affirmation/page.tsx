import { generateSEO } from "@/lib/seo"
import Affirmation from "./affirmation";

export const metadata = generateSEO({
    title: "Add Affirmation",
    description: "Add Affirmation",
    path: "/affirmation",
    keywords: ["Heal", "Add Affirmation"],
});


// SERVER COMPONENT
export default function AddAffirmationPage() {
    return <Affirmation />
}
