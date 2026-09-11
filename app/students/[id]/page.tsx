import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

// 🎨 Bảng màu tinh giản: Giữ lại màu đặc trưng nhưng làm dịu đi (Soft UI)
const STUDENT_THEMES = [
  {
    decoBg: "bg-blue-50/50",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
    iconBg: "bg-blue-50 text-blue-600",
    hoverBorder: "hover:border-blue-200 hover:ring-4 hover:ring-blue-50/50",
    featuredBg: "bg-slate-900 text-white shadow-lg", // Thẻ nổi bật dùng nền Dark chuyên nghiệp
    featuredIconBg: "bg-white/10 text-white",
    footerHover: "group-hover:text-blue-600",
  },
  {
    decoBg: "bg-emerald-50/50",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-600",
    iconBg: "bg-emerald-50 text-emerald-600",
    hoverBorder:
      "hover:border-emerald-200 hover:ring-4 hover:ring-emerald-50/50",
    featuredBg: "bg-slate-900 text-white shadow-lg",
    featuredIconBg: "bg-white/10 text-white",
    footerHover: "group-hover:text-emerald-600",
  },
  {
    decoBg: "bg-purple-50/50",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-600",
    iconBg: "bg-purple-50 text-purple-600",
    hoverBorder: "hover:border-purple-200 hover:ring-4 hover:ring-purple-50/50",
    featuredBg: "bg-slate-900 text-white shadow-lg",
    featuredIconBg: "bg-white/10 text-white",
    footerHover: "group-hover:text-purple-600",
  },
  {
    decoBg: "bg-amber-50/50",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
    iconBg: "bg-amber-50 text-amber-600",
    hoverBorder: "hover:border-amber-200 hover:ring-4 hover:ring-amber-50/50",
    featuredBg: "bg-slate-900 text-white shadow-lg",
    featuredIconBg: "bg-white/10 text-white",
    footerHover: "group-hover:text-amber-600",
  },
];

function getStudentTheme(studentId: string) {
  let hash = 0;
  for (let i = 0; i < studentId.length; i++) {
    hash = studentId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % STUDENT_THEMES.length;
  return STUDENT_THEMES[index];
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

// BỘ SVG ICONS CHUYÊN NGHIỆP THAY THẾ EMOJI
const Icons = {
  grades: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
      />
    </svg>
  ),
  assignments: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  resources: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  progress: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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

  return (
    <main className="min-h-screen bg-slate-50 antialiased font-sans">
      {/* Header Tối giản */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
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
              Back to Directory
            </Link>
            <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900">
              Student Portal
            </h1>
          </div>
          <div
            className={`hidden sm:flex h-10 w-10 items-center justify-center rounded-full font-bold ${theme.badgeBg} ${theme.badgeText}`}
          >
            {typedStudent.name.charAt(0)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        {/* Profile Header chuyên nghiệp */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-10 shadow-sm border border-slate-200">
          <div
            className={`absolute -right-20 -top-20 h-64 w-64 rounded-full ${theme.decoBg}`}
          />

          <div className="relative flex flex-col items-center text-center sm:flex-row sm:text-left gap-6 sm:gap-8">
            <div className="shrink-0">
              <img
                src={typedStudent.avatar}
                alt={`${typedStudent.name}'s avatar`}
                className="h-24 w-24 rounded-full object-cover ring-1 ring-slate-200 shadow-sm"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-500">
                Welcome back,
              </p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                {typedStudent.name}
              </h2>

              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText}`}
                >
                  {typedStudent.grade}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  {typedStudent.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          <DashboardStat
            title="Grades"
            value="—"
            desc="No grades yet"
            theme={theme}
          />
          <DashboardStat
            title="Assignments"
            value="—"
            desc="No assignments yet"
            theme={theme}
          />
          <div className="col-span-2 md:col-span-1">
            <DashboardStat
              title="Progress"
              value="—"
              desc="Coming soon"
              theme={theme}
            />
          </div>
        </div>

        {/* Cards Section */}
        <div className="mt-12">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-500">
            Workspace
          </h3>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DashboardCard
              href={`/students/${typedStudent.id}/assignments`}
              icon={Icons.assignments}
              title="Assignments"
              description="Manage your upcoming deadlines and submit your coursework."
              action="View Assignments"
              theme={theme}
              isFeatured={true}
            />
            <DashboardCard
              href={`/students/${typedStudent.id}/resources`}
              icon={Icons.resources}
              title="Learning Resources"
              description="Access syllabus, documents, and reference materials."
              action="Open Resources"
              theme={theme}
              isFeatured={true}
            />
            <DashboardCard
              href={`/students/${typedStudent.id}/grades`}
              icon={Icons.grades}
              title="Grades & Scores"
              description="Review your academic performance and recent test results."
              action="Check Grades"
              theme={theme}
            />
            <DashboardCard
              href={`/students/${typedStudent.id}/progress`}
              icon={Icons.progress}
              title="Progress Tracker"
              description="Monitor your overall learning journey and milestones."
              action="View Progress"
              theme={theme}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardStat({ title, value, desc, theme }: any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-400">{desc}</p>
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
      className={`group flex flex-col justify-between rounded-3xl border p-6 transition-all duration-300 ${
        isFeatured
          ? `${theme.featuredBg} hover:-translate-y-1`
          : `border-slate-200 bg-white ${theme.hoverBorder}`
      }`}
    >
      <div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${isFeatured ? theme.featuredIconBg : theme.iconBg}`}
        >
          {icon}
        </div>
        <h3
          className={`mt-6 text-xl font-bold ${isFeatured ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 text-sm leading-relaxed ${isFeatured ? "text-slate-300" : "text-slate-500"}`}
        >
          {description}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span
          className={`text-sm font-bold transition-colors ${isFeatured ? "text-white group-hover:text-slate-300" : `text-slate-500 ${theme.footerHover}`}`}
        >
          {action}
        </span>
        <svg
          className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${isFeatured ? "text-white" : "text-slate-400 group-hover:text-slate-900"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </Link>
  );
}
