import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAllTeachers } from "@/app/actions/teacher-actions";
import AdminDashboardClient, { Teacher } from "./AdminDashboardClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const result = await getAllTeachers();
  const teachers = result.success ? result.data : [];

  return <AdminDashboardClient initialTeachers={teachers as Teacher[]} />;
}
