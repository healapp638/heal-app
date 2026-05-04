import { generateSEO } from "@/lib/seo"
import Users from "./users";

export const metadata = generateSEO({
  title: "Users",
  description: "List of Users",
  path: "/users",
  keywords: ["Heal", "Users", "Technology Company"],
});


// SERVER COMPONENT
export default function UsersPage() {
  return <Users />
}
