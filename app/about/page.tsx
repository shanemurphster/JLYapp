import { redirect } from "next/navigation";

// Route moved to /support
export default function AboutRedirect() {
  redirect("/support");
}
