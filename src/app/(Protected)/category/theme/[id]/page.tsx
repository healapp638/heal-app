import { generateSEO } from "@/lib/seo"
import HomeTheme from "./theme";

export const metadata = generateSEO({
  title: "Home Theme",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/category/theme",
  keywords: ["Heal", "Home Theme", "Technology Company"],
});


// SERVER COMPONENT
export default function HomeThemePage() {
  return <HomeTheme />
}
