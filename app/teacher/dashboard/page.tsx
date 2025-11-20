import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAssignmentsByTeacher } from "@/app/actions/assignment-actions";
import TeacherDashboardClient, { Assignment } from "./TeacherDashboardClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    redirect("/auth/signin");
  }

  const result = await getAssignmentsByTeacher(session.user.id);
  const assignments = result.success ? result.data : [];

  return (
    <TeacherDashboardClient
      teacherId={session.user.id}
      teacherName={session.user.name}
      initialAssignments={assignments as Assignment[]}
    />
  );
}
