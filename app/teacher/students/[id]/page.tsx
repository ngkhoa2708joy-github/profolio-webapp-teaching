import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AddResourceForm from "../../../../components/AddResourceForm";
import DeleteResourceButton from "../../../../components/DeleteResourceButton";

import AddAssignmentForm from "../../../../components/AddAssignmentForm";
import StudentManagementTabs from "../../../../components/StudentManagementTabs";

interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  email: string;
}

interface Resource {
  id: string;
  student_id: string;
  title: string;
  describe: string;
  subject: string;
  type: string;
  url: string;
  created_at: string;
}

interface AssignmentFile {
  id: string;
  assignment_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  created_at: string;
}

interface Assignment {
  id: string;
  student_id: string;
  title: string;
  description: string;
  due_day: string;
  status: string;
  created_at: string;
  file_required: boolean;
  file?: AssignmentFile | null;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ManageStudentPage({ params }: PageProps) {
  const { id } = await params;

  // Get student
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (studentError || !student) {
    notFound();
  }

  // Get this student's resources
  const { data: resources, error: resourceError } = await supabase
    .from("learning_resource")
    .select("*")
    .eq("student_id", id)
    .order("created_at", { ascending: false });

  if (resourceError) {
    console.error("RESOURCE ERROR:", resourceError);
  }

  // Get this student's assignments
  const { data: assignments, error: assignmentError } = await supabase
    .from("assignments")
    .select("*")
    .eq("student_id", id)
    .order("created_at", { ascending: false });

  if (assignmentError) {
    console.error("ASSIGNMENT ERROR:", assignmentError);
  }

  // Get files attached to this student's assignments
  const { data: assignmentFiles, error: assignmentFileError } = await supabase
    .from("assignment_files")
    .select("*")
    .in(
      "assignment_id",
      (assignments ?? []).map((assignment) => assignment.id),
    );

  if (assignmentFileError) {
    console.error("ASSIGNMENT FILE ERROR:", assignmentFileError);
  }

  // Get this student's subject
  const { data: subjects, error: subjectError } = await supabase
    .from("subjects")
    .select("*")
    .eq("student_id", id);

  if (subjectError) {
    console.error("SUBJECT ERROR:", subjectError);
  }

  const typedSubjects = subjects ?? [];
  const typedStudent = student as Student;
  const typedResources = (resources ?? []) as Resource[];

  const typedAssignments: Assignment[] = (assignments ?? []).map(
    (assignment) => ({
      ...assignment,
      file:
        (assignmentFiles ?? []).find(
          (file) => file.assignment_id === assignment.id,
        ) ?? null,
    }),
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8">
          <Link
            href="/teacher"
            className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
          >
            ← Back to Teacher Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:py-12">
        {/* Student profile */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <img
              src={typedStudent.avatar}
              alt={`${typedStudent.name}'s avatar`}
              className="h-20 w-20 rounded-2xl object-cover"
            />

            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Student Management
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {typedStudent.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  {typedStudent.grade}
                </span>

                <span className="text-sm text-slate-500">
                  {typedStudent.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <StudentManagementTabs
          studentId={typedStudent.id}
          studentName={typedStudent.name}
          resources={typedResources}
          assignments={typedAssignments}
          subjects={typedSubjects}
        />
      </section>
    </main>
  );
}
