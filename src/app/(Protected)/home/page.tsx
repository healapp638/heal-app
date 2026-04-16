import { generateSEO } from "@/lib/seo"
import DashboardClient from "./DashboardClient"

export const metadata = generateSEO({
  title: "Home",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/home",
  keywords: ["Heal", "Home", "Technology Company"],
});


// SERVER COMPONENT
export default function DashboardPage() {
  return <DashboardClient />
}
