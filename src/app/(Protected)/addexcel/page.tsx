import { generateSEO } from "@/lib/seo"
import AddExcel from "./addexcel";

export const metadata = generateSEO({
  title: "Add Excel",
  description: "Add Excel",
  path: "/addexcel",
  keywords: ["Heal", "Add Excel"],
});


// SERVER COMPONENT
export default function AddExcelPage() {
  return <AddExcel />
}
