import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

// 🎨 Bảng phối màu Pastel đồng bộ từ StudentCard
const STUDENT_THEMES = [
  {
    decoBg: "bg-blue-50/80",
    decoBgAlt: "bg-blue-100/40",
    avatarRing: "ring-blue-100/50",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
    badgeRing: "ring-blue-500/10",
    hoverBorder: "hover:border-blue-300",
    hoverShadow: "hover:shadow-blue-100/50",
    arrowHoverBg: "group-hover:bg-blue-600",
    footerHover: "group-hover:text-blue-600",
    iconText: "text-blue-600",
  },
  {
    decoBg: "bg-emerald-50/80",
    decoBgAlt: "bg-emerald-100/40",
    avatarRing: "ring-emerald-100/50",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-600",
    badgeRing: "ring-emerald-500/10",
    hoverBorder: "hover:border-emerald-300",
    hoverShadow: "hover:shadow-emerald-100/50",
    arrowHoverBg: "group-hover:bg-emerald-600",
    footerHover: "group-hover:text-emerald-600",
    iconText: "text-emerald-600",
  },
  {
    decoBg: "bg-purple-50/80",
    decoBgAlt: "bg-purple-100/40",
    avatarRing: "ring-purple-100/50",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-600",
    badgeRing: "ring-purple-500/10",
    hoverBorder: "hover:border-purple-300",
    hoverShadow: "hover:shadow-purple-100/50",
    arrowHoverBg: "group-hover:bg-purple-600",
    footerHover: "group-hover:text-purple-600",
    iconText: "text-purple-600",
  },
  {
    decoBg: "bg-amber-50/80",
    decoBgAlt: "bg-amber-100/40",
    avatarRing: "ring-amber-100/50",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
    badgeRing: "ring-amber-500/10",
    hoverBorder: "hover:border-amber-300",
    hoverShadow: "hover:shadow-amber-100/50",
    arrowHoverBg: "group-hover:bg-amber-500",
    footerHover: "group-hover:text-amber-600",
    iconText: "text-amber-600",
  },
  {
    decoBg: "bg-rose-50/80",
    decoBgAlt: "bg-rose-100/40",
    avatarRing: "ring-rose-100/50",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-600",
    badgeRing: "ring-rose-500/10",
    hoverBorder: "hover:border-rose-300",
    hoverShadow: "hover:shadow-rose-100/50",
    arrowHoverBg: "group-hover:bg-rose-600",
    footerHover: "group-hover:text-rose-600",
    iconText: "text-rose-600",
  },
  {
    decoBg: "bg-cyan-50/80",
    decoBgAlt: "bg-cyan-100/40",
    avatarRing: "ring-cyan-100/50",
    badgeBg: "bg-cyan-50",
    badgeText: "text-cyan-600",
    badgeRing: "ring-cyan-500/10",
    hoverBorder: "hover:border-cyan-300",
    hoverShadow: "hover:shadow-cyan-100/50",
    arrowHoverBg: "group-hover:bg-cyan-600",
    footerHover: "group-hover:text-cyan-600",
    iconText: "text-cyan-600",
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
  // Lấy màu chủ đạo của học sinh để truyền vào toàn bộ dashboard
  const theme = getStudentTheme(typedStudent.id);

  return (
    <main className="min-h-screen bg-slate-50 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:py-4">
          <div>
            <Link
              href="/"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors ${theme.footerHover}`}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to Directory</span>
            </Link>

            <h1 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Student Portal
            </h1>
          </div>

          {/* Avatar nhỏ góc phải trên Laptop (ẩn trên mobile) */}
          <div
            className={`hidden sm:flex h-10 w-10 items-center justify-center rounded-xl font-bold ${theme.badgeBg} ${theme.badgeText}`}
          >
            {typedStudent.name.charAt(0)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10">
        {/* Welcome / Profile Header */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-slate-200">
          {/* Background decoration */}
          <div
            className={`absolute -right-20 -top-20 h-64 w-64 rounded-full ${theme.decoBg}`}
          />
          <div
            className={`absolute -bottom-24 right-20 sm:right-40 h-40 w-40 rounded-full ${theme.decoBgAlt}`}
          />

          <div className="relative flex flex-col items-center text-center sm:flex-row sm:text-left gap-5 sm:gap-6">
            {/* Avatar Responsive */}
            <div className="relative shrink-0">
              <img
                src={typedStudent.avatar}
                alt={`${typedStudent.name}'s avatar`}
                className={`h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-cover ring-4 ring-white shadow-sm ${theme.avatarRing}`}
              />
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-400 shadow-sm" />
            </div>

            {/* Student info */}
            <div className="flex-1">
              <p className={`text-xs sm:text-sm font-bold ${theme.badgeText}`}>
                Welcome back 👋
              </p>

              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {typedStudent.name}
              </h2>

              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider ring-1 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeRing}`}
                >
                  {typedStudent.grade}
                </span>

                <span className="text-xs sm:text-sm font-medium text-slate-500">
                  {typedStudent.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          <DashboardStat
            title="Grades"
            value="—"
            description="No grades yet"
            icon="📊"
            theme={theme}
          />
          <DashboardStat
            title="Assignments"
            value="—"
            description="No assignments yet"
            icon="📝"
            theme={theme}
          />
          {/* Card thứ 3 trên Mobile sẽ chiếm trọn 2 cột để không bị lép */}
          <div className="col-span-2 md:col-span-1">
            <DashboardStat
              title="Progress"
              value="—"
              description="Coming soon"
              icon="🚀"
              theme={theme}
            />
          </div>
        </div>

        {/* Dashboard Cards Sections */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <DashboardCard
            href={`/students/${typedStudent.id}/grades`}
            icon="📊"
            title="Grades"
            description="View your grades, test results, and academic performance."
            action="View grades"
            theme={theme}
          />
          <DashboardCard
            href={`/students/${typedStudent.id}/assignments`}
            icon="📝"
            title="Assignments"
            description="Check your upcoming assignments and completed work."
            action="View assignments"
            theme={theme}
          />
          <DashboardCard
            href={`/students/${typedStudent.id}/resources`}
            icon="📚"
            title="Learning Resources"
            description="Access notes, documents, exercises, and study materials."
            action="Open resources"
            theme={theme}
          />
          <DashboardCard
            href={`/students/${typedStudent.id}/progress`}
            icon="🎯"
            title="My Progress"
            description="Track your learning progress and see what to focus on next."
            action="View progress"
            theme={theme}
          />
        </div>
      </section>
    </main>
  );
}

/* ----------------------------- */
/* Dashboard Stat Component      */
/* ----------------------------- */

function DashboardStat({
  title,
  value,
  description,
  icon,
  theme,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
  theme: any;
}) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {title}
          </p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-[10px] sm:text-xs font-medium text-slate-400">
            {description}
          </p>
        </div>
        <div
          className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-base sm:text-lg ${theme.badgeBg} ${theme.iconText}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- */
/* Dashboard Card Component      */
/* ----------------------------- */

function DashboardCard({
  href,
  icon,
  title,
  description,
  action,
  theme,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  action: string;
  theme: any;
}) {
  return (
    <Link
      href={href}
      className={`group block rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.hoverBorder} ${theme.hoverShadow}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl text-lg sm:text-xl transition-transform duration-300 group-hover:scale-110 ${theme.badgeBg}`}
        >
          {icon}
        </div>

        <div
          className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:text-white ${theme.arrowHoverBg}`}
        >
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 sm:mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      <div className="mt-5 sm:mt-6 border-t border-slate-100 pt-3 sm:pt-4">
        <span
          className={`text-xs sm:text-sm font-bold text-slate-500 transition-colors ${theme.footerHover}`}
        >
          {action} →
        </span>
      </div>
    </Link>
  );
}
