import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

// Soft accent palette: subtle on light UI, stronger on interactive states.
const STUDENT_THEMES = [
  {
    accent: "blue",
    decoBg: "bg-blue-100/60",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    iconBg: "bg-blue-50 text-blue-600",
    hoverBorder: "hover:border-blue-200 hover:shadow-blue-100/60",
    featuredBg:
      "bg-slate-950 text-white hover:bg-slate-900 hover:shadow-slate-300/40",
    featuredIconBg: "bg-white/10 text-white",
    footerHover: "group-hover:text-blue-600",
  },
  {
    accent: "emerald",
    decoBg: "bg-emerald-100/60",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    iconBg: "bg-emerald-50 text-emerald-600",
    hoverBorder: "hover:border-emerald-200 hover:shadow-emerald-100/60",
    featuredBg:
      "bg-slate-950 text-white hover:bg-slate-900 hover:shadow-slate-300/40",
    featuredIconBg: "bg-white/10 text-white",
    footerHover: "group-hover:text-emerald-600",
  },
  {
    accent: "purple",
    decoBg: "bg-purple-100/60",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    iconBg: "bg-purple-50 text-purple-600",
    hoverBorder: "hover:border-purple-200 hover:shadow-purple-100/60",
    featuredBg:
      "bg-slate-950 text-white hover:bg-slate-900 hover:shadow-slate-300/40",
    featuredIconBg: "bg-white/10 text-white",
    footerHover: "group-hover:text-purple-600",
  },
  {
    accent: "amber",
    decoBg: "bg-amber-100/60",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    iconBg: "bg-amber-50 text-amber-600",
    hoverBorder: "hover:border-amber-200 hover:shadow-amber-100/60",
    featuredBg:
      "bg-slate-950 text-white hover:bg-slate-900 hover:shadow-slate-300/40",
    featuredIconBg: "bg-white/10 text-white",
    footerHover: "group-hover:text-amber-600",
  },
];

function getStudentTheme(studentId: string) {
  let hash = 0;
  for (let i = 0; i < studentId.length; i++) {
    hash = studentId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return STUDENT_THEMES[Math.abs(hash) % STUDENT_THEMES.length];
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  email: string;
}

interface StudentPageProps {
  params: Promise<{ id: string }>;
}

const Icons = {
  grades: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
      />
    </svg>
  ),
  assignments: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  resources: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  progress: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  arrow: (
    <svg
      className="h-4.5 w-4.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  ),
  back: (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  ),
};

export default async function StudentDashboard({ params }: StudentPageProps) {
  const { id } = await params;

  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !student) notFound();

  const typedStudent = student as Student;
  const theme = getStudentTheme(typedStudent.id);
  const initials = typedStudent.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#f6f7fb] font-sans text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
              {Icons.back}
            </span>
            <span className="hidden sm:inline">Back to Directory</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Student Portal
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {typedStudent.name}
              </p>
            </div>
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white shadow-sm ${theme.badgeBg} ${theme.badgeText}`}
              aria-label={`${typedStudent.name} profile`}
            >
              <span className="text-xs font-extrabold tracking-wide">
                {initials}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Profile / hero */}
        <div className="relative isolate overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_50px_-24px_rgba(15,23,42,0.22)]">
          <div
            className={`pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full blur-2xl ${theme.decoBg}`}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50/80 to-transparent" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-7 md:flex-row md:items-center md:gap-7 lg:p-9">
            <div className="relative mx-auto shrink-0 md:mx-0">
              <div className="absolute -inset-1 rounded-full bg-white shadow-md ring-1 ring-slate-200/80" />
              <img
                src={typedStudent.avatar}
                alt={`${typedStudent.name}'s avatar`}
                className="relative h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
              />
              <span
                className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${
                  theme.accent === "blue"
                    ? "bg-blue-500"
                    : theme.accent === "emerald"
                      ? "bg-emerald-500"
                      : theme.accent === "purple"
                        ? "bg-purple-500"
                        : "bg-amber-500"
                }`}
                aria-label="Active"
              />
            </div>

            <div className="min-w-0 flex-1 text-center md:text-left">
              <p className="text-sm font-semibold text-slate-500">
                Welcome back,
              </p>
              <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <h1 className="truncate text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  {typedStudent.name}
                </h1>
                <span
                  className={`inline-flex self-center rounded-full border border-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] shadow-sm sm:self-auto ${theme.badgeBg} ${theme.badgeText}`}
                >
                  {typedStudent.grade}
                </span>
              </div>
              <p className="mt-2 break-all text-sm font-medium text-slate-500 sm:break-normal">
                {typedStudent.email}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3">
          <DashboardStat
            title="Grades"
            value="—"
            desc="No grades yet"
            icon={Icons.grades}
          />
          <DashboardStat
            title="Assignments"
            value="—"
            desc="No assignments yet"
            icon={Icons.assignments}
          />
          <div className="col-span-2 md:col-span-1">
            <DashboardStat
              title="Progress"
              value="—"
              desc="Coming soon"
              icon={Icons.progress}
            />
          </div>
        </div>

        {/* Workspace */}
        <div className="mt-9 sm:mt-12">
          <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Workspace
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Your learning space
              </h2>
            </div>
            <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 sm:inline-flex">
              4 sections
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-2">
            <DashboardCard
              href={`/students/${typedStudent.id}/assignments`}
              icon={Icons.assignments}
              title="Assignments"
              description="Manage upcoming deadlines and submit your coursework."
              action="View Assignments"
              theme={theme}
              isFeatured
            />
            <DashboardCard
              href={`/students/${typedStudent.id}/resources`}
              icon={Icons.resources}
              title="Learning Resources"
              description="Access syllabus, documents, notes, and reference materials."
              action="Open Resources"
              theme={theme}
              isFeatured
            />
            <DashboardCard
              href={`/students/${typedStudent.id}/grades`}
              icon={Icons.grades}
              title="Grades & Scores"
              description="Review academic performance and recent test results."
              action="Check Grades"
              theme={theme}
            />
            <DashboardCard
              href={`/students/${typedStudent.id}/progress`}
              icon={Icons.progress}
              title="Progress Tracker"
              description="Monitor your learning journey, milestones, and progress."
              action="View Progress"
              theme={theme}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardStat({ title, value, desc, icon }: any) {
  return (
    <div className="group rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_8px_28px_-22px_rgba(15,23,42,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-[11px] font-medium leading-4 text-slate-400 sm:text-xs">
            {desc}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition-transform duration-200 group-hover:scale-105">
          {icon}
        </span>
      </div>
    </div>
  );
}

function DashboardCard({
  href,
  icon,
  title,
  description,
  action,
  theme,
  isFeatured,
}: any) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[24px] border p-5 shadow-[0_12px_34px_-26px_rgba(15,23,42,0.35)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:min-h-[220px] sm:p-6 ${
        isFeatured
          ? `${theme.featuredBg} border-slate-800 shadow-lg hover:-translate-y-1`
          : `border-slate-200/90 bg-white ${theme.hoverBorder} hover:-translate-y-0.5 hover:shadow-lg`
      }`}
    >
      <span
        className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 ${
          isFeatured ? "bg-white/[0.06]" : theme.decoBg
        }`}
      />

      <div className="relative">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-[14px] transition-transform duration-300 group-hover:scale-105 ${
            isFeatured ? theme.featuredIconBg : theme.iconBg
          }`}
        >
          {icon}
        </div>
        <h3
          className={`mt-5 text-lg font-extrabold tracking-tight sm:text-xl ${
            isFeatured ? "text-white" : "text-slate-950"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 max-w-xl text-sm leading-6 ${
            isFeatured ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>

      <div className="relative mt-7 flex items-center justify-between gap-4">
        <span
          className={`text-sm font-bold transition-colors ${
            isFeatured
              ? "text-white group-hover:text-slate-300"
              : `text-slate-500 ${theme.footerHover}`
          }`}
        >
          {action}
        </span>
        <span
          className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-300 group-hover:translate-x-0.5 ${
            isFeatured
              ? "border-white/10 bg-white/10 text-white"
              : "border-slate-200 bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-900"
          }`}
        >
          {Icons.arrow}
        </span>
      </div>
    </Link>
  );
}
