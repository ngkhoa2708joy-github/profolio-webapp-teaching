import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  email: string;
}

interface StudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDashboard({ params }: StudentPageProps) {
  const { id } = await params;

  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !student) {
    notFound();
  }

  const typedStudent = student as Student;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
            >
              ← All students
            </Link>

            <h1 className="mt-2 text-xl font-bold text-slate-900">
              Student Portal
            </h1>
          </div>

          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white sm:flex">
            S
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:py-12">
        {/* Welcome / Profile */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-50" />
          <div className="absolute -bottom-24 right-40 h-40 w-40 rounded-full bg-indigo-50" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <img
              src={typedStudent.avatar}
              alt={`${typedStudent.name}'s avatar`}
              className="h-24 w-24 rounded-3xl object-cover ring-4 ring-slate-50"
            />

            {/* Student info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-600">
                Welcome back 👋
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {typedStudent.name}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3">
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

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DashboardStat
            title="Grades"
            value="—"
            description="No grades yet"
            icon="📊"
          />

          <DashboardStat
            title="Assignments"
            value="—"
            description="No assignments yet"
            icon="📝"
          />

          <DashboardStat
            title="Progress"
            value="—"
            description="Coming soon"
            icon="🚀"
          />
        </div>

        {/* Dashboard Sections */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Grades */}
          <DashboardCard
            href={`/students/${typedStudent.id}/grades`}
            icon="📊"
            title="Grades"
            description="View your grades, test results, and academic performance."
            action="View grades"
          />

          {/* Assignments */}
          <DashboardCard
            href={`/students/${typedStudent.id}/assignments`}
            icon="📝"
            title="Assignments"
            description="Check your upcoming assignments and completed work."
            action="View assignments"
          />

          {/* Resources */}
          <DashboardCard
            href={`/students/${typedStudent.id}/resources`}
            icon="📚"
            title="Learning Resources"
            description="Access notes, documents, exercises, and study materials."
            action="Open resources"
          />

          {/* Progress */}
          <DashboardCard
            href={`/students/${typedStudent.id}/progress`}
            icon="🎯"
            title="My Progress"
            description="Track your learning progress and see what to focus on next."
            action="View progress"
          />
        </div>
      </section>
    </main>
  );
}

/* ----------------------------- */
/* Dashboard Stat                */
/* ----------------------------- */

function DashboardStat({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- */
/* Dashboard Card                */
/* ----------------------------- */

function DashboardCard({
  href,
  icon,
  title,
  description,
  action,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
          →
        </div>
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <span className="text-sm font-semibold text-slate-500 transition-colors group-hover:text-blue-600">
          {action} →
        </span>
      </div>
    </Link>
  );
}
