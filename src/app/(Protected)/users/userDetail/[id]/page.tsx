import { generateSEO } from "@/lib/seo"
import UserDetail from "./userDetail";

export const metadata = generateSEO({
  title: "User Detail",
  description: "Learn how Heal builds scalable, future-ready digital solutions.",
  path: "/users/userDetail/[id]",
  keywords: ["Heal", "User Detail", "Technology Company"],
});


// SERVER COMPONENT
export default function UserDetailPage() {
  return <UserDetail />
}
