import { generateSEO } from "@/lib/seo"
import Profile from "./profile";

export const metadata = generateSEO({
  title: "Profile",
  description: "Learn how Heal Profile.",
  path: "/profile",
  keywords: ["Heal", "Profile", "Technology Company"],
});


// SERVER COMPONENT
export default function ProfilePage() {
  return <Profile />
}