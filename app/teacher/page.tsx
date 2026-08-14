import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default async function TeacherDashboard() {
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("STUDENTS ERROR:", error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Unable to load students
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading the student list.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
              >
                ← Back to profiles
              </Link>

              <p className="mt-5 text-sm font-semibold text-indigo-600">
                Teacher Dashboard
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Welcome back 👋
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage your students and their learning materials.
              </p>
            </div>

            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl sm:flex">
              👨‍🏫
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Students</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {students?.length ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Learning Resources
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">—</p>

            <p className="mt-1 text-xs text-slate-400">
              We'll connect this next
            </p>
          </div>
        </div>

        {/* Students */}
        <div className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Your Students</h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a student to manage their learning resources.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {students && students.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Student */}
                    <div className="flex items-center gap-4">
                      <img
                        src={student.avatar}
                        alt={`${student.name}'s avatar`}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {student.name}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                            {student.grade}
                          </span>

                          <span className="text-xs text-slate-400">
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Manage */}
                    <Link
                      href={`/teacher/students/${student.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-md"
                    >
                      Manage
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  👨‍🎓
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No students yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your students will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
