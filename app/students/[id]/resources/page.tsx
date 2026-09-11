import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

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

interface ResourcesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { id } = await params;

  // Lấy dữ liệu resources từ Supabase[cite: 1]
  const { data: resources, error } = await supabase
    .from("learning_resource")
    .select("*")
    .eq("student_id", id)
    .order("created_at", { ascending: false });

  // Xử lý lỗi load dữ liệu[cite: 1]
  if (error) {
    console.error("RESOURCE ERROR:", error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 antialiased">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg shadow-red-500/5">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Unable to load resources
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading your learning materials.
          </p>
        </div>
      </main>
    );
  }

  // Chia tách Assignment & Tài liệu thông thường để dễ quản lý (Nâng cao UI)
  const assignments =
    resources?.filter(
      (r) =>
        r.type.toLowerCase().includes("homework") ||
        r.type.toLowerCase().includes("assignment"),
    ) || [];
  const studyMaterials =
    resources?.filter(
      (r) =>
        !r.type.toLowerCase().includes("homework") &&
        !r.type.toLowerCase().includes("assignment"),
    ) || [];

  return (
    <main className="min-h-screen bg-slate-50 antialiased selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 md:px-8">
          <Link
            href={`/students/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-blue-600"
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
            Back to dashboard
          </Link>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Learning Center
                </p>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Your Materials & Assignments
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                Access your homework, exercises, and required reading in one
                organized space.
              </p>
            </div>

            {/* Stats Badge */}
            {resources && resources.length > 0 && (
              <div className="inline-flex h-fit items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 border border-blue-100">
                <span className="text-xl font-bold text-blue-700">
                  {resources.length}
                </span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Total Items
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 lg:py-12">
        {!resources || resources.length === 0 ? (
          /* Empty State - Modern UI */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl shadow-inner ring-1 ring-blue-100">
              📚
            </div>
            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No resources yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              Your learning materials will automatically appear here once your
              teacher adds them.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* PRIORITY SECTION 1: ASSIGNMENTS & HOMEWORK */}
            {assignments.length > 0 && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Priority Assignments
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {assignments.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      isPriority={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PRIORITY SECTION 2: STUDY MATERIALS */}
            {studyMaterials.length > 0 && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Study Materials
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {studyMaterials.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      isPriority={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

/* ----------------------------- */
/* Resource Card Component       */
/* ----------------------------- */

function ResourceCard({
  resource,
  isPriority,
}: {
  resource: Resource;
  isPriority: boolean;
}) {
  // Define themes based on whether it's a priority assignment or regular material
  const theme = isPriority
    ? {
        bg: "bg-white",
        border: "border-rose-200",
        hoverBorder: "group-hover:border-rose-300",
        hoverShadow: "group-hover:shadow-rose-100/50",
        iconBg: "bg-rose-50",
        subjectText: "text-rose-600",
        titleHover: "group-hover:text-rose-600",
        arrowHover: "group-hover:text-rose-600",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-700",
        dateText: "text-rose-500 hover:text-rose-700",
      }
    : {
        bg: "bg-white",
        border: "border-slate-200",
        hoverBorder: "group-hover:border-blue-300",
        hoverShadow: "group-hover:shadow-blue-100/40",
        iconBg: "bg-blue-50",
        subjectText: "text-blue-600",
        titleHover: "group-hover:text-blue-600",
        arrowHover: "group-hover:text-blue-600",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-600",
        dateText: "text-indigo-500 hover:text-indigo-700",
      };

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block outline-none"
    >
      <article
        className={`relative flex flex-col h-full rounded-3xl border ${theme.border} ${theme.bg} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.hoverBorder} ${theme.hoverShadow}`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl transition-transform duration-300 group-hover:scale-110 ${theme.iconBg}`}
          >
            {getResourceIcon(resource.type)}
          </div>

          <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${theme.badgeBg} ${theme.badgeText}`}
          >
            {resource.type}
          </span>
        </div>

        {/* Content Body */}
        <div className="mt-5 flex-1">
          <p
            className={`text-[11px] font-bold uppercase tracking-wider ${theme.subjectText}`}
          >
            {resource.subject}
          </p>

          <h2
            className={`mt-1.5 text-lg font-bold leading-tight text-slate-900 transition-colors ${theme.titleHover}`}
          >
            {resource.title}
          </h2>

          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {resource.describe}
          </p>
        </div>

        {/* Footer info (Date & Action) */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-end justify-between">
            <p className={`text-xs font-semibold ${theme.dateText}`}>
              Added:{" "}
              {new Date(resource.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>

            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-bold text-slate-500 transition-colors ${theme.arrowHover}`}
              >
                Open
              </span>
              <svg
                className={`h-4 w-4 text-slate-300 transition-all duration-300 group-hover:translate-x-1 ${theme.arrowHover}`}
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
        </div>
      </article>
    </a>
  );
}

/* ----------------------------- */
/* Resource Icon Helper          */
/* ----------------------------- */

function getResourceIcon(type: string) {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes("pdf")) return "📄";
  if (
    normalizedType.includes("homework") ||
    normalizedType.includes("assignment")
  )
    return "🎯";
  if (normalizedType.includes("exercise") || normalizedType.includes("quiz"))
    return "✍️";
  if (normalizedType.includes("video") || normalizedType.includes("recording"))
    return "🎬";
  if (normalizedType.includes("link") || normalizedType.includes("website"))
    return "🔗";
  if (normalizedType.includes("image") || normalizedType.includes("photo"))
    return "🖼️";
  if (normalizedType.includes("audio") || normalizedType.includes("podcast"))
    return "🎧";

  return "📚";
}
