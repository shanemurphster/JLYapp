import { redirect } from "next/navigation";

// Route moved to /install
export default function SettingsRedirect() {
  redirect("/install");
}
