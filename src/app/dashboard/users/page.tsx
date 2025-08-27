import { Metadata } from "next"
import { ClientPage } from "./components/client-page"

export const metadata: Metadata = {
  title: "Users",
  description: "User management dashboard.",
}

export default async function UsersPage() {
  // Remove server-side data fetching since we'll use client-side with pagination
  return <ClientPage users={[]} />
}
