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

  // Get resources belonging to this student
  const { data: resources, error } = await supabase
    .from("learning_resource")
    .select("*")
    .eq("student_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("RESOURCE ERROR:", error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Unable to load resources
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading your learning resources.
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
          <Link
            href={`/students/${id}`}
            className="text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
          >
            ← Back to dashboard
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold text-blue-600">
              Learning Resources
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Your learning materials
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Access your study materials, homework, exercises, and other
              resources in one place.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        {!resources || resources.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📚
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No resources yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your learning materials will appear here once they are added.
            </p>
          </div>
        ) : (
          <>
            {/* Resource count */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  You have{" "}
                  <span className="font-semibold text-slate-900">
                    {resources.length}
                  </span>{" "}
                  resource{resources.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Resource grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

/* ----------------------------- */
/* Resource Card                 */
/* ----------------------------- */

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <article className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-100/40">
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
            {getResourceIcon(resource.type)}
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {resource.type}
          </span>
        </div>

        {/* Content */}
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {resource.subject}
          </p>

          <h2 className="mt-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
            {resource.title}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {resource.describe}
          </p>

          <p className="mt-2 text-right text-sm font-semibold text-indigo-500 hover:text-indigo-700">
            {new Date(resource.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-semibold text-slate-500 transition-colors group-hover:text-blue-600">
            Open resource
          </span>

          <span className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-600">
            →
          </span>
        </div>
      </article>
    </a>
  );
}

/* ----------------------------- */
/* Resource Icon                 */
/* ----------------------------- */

function getResourceIcon(type: string) {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes("pdf")) {
    return "📄";
  }

  if (normalizedType.includes("homework")) {
    return "📝";
  }

  if (normalizedType.includes("exercise")) {
    return "✏️";
  }

  if (normalizedType.includes("video")) {
    return "🎥";
  }

  if (normalizedType.includes("link")) {
    return "🔗";
  }

  return "📚";
}
