"use client";

import { useState } from "react";
import AddResourceForm from "./AddResourceForm";
import AddAssignmentForm from "./AddAssignmentForm";
import ResourceCardActions from "./ResourceCardActions";
import AssignmentCardActions from "./AssignmentCardActions";
import { supabase } from "../lib/supabase";

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

interface Subject {
  id: string;
  name: string;
}

interface Props {
  studentId: string;
  studentName: string;
  resources: Resource[];
  assignments: Assignment[];
  subjects: Subject[];
}

export default function StudentManagementTabs({
  studentId,
  studentName,
  resources,
  assignments,
  subjects,
}: Props) {
  const [activeTab, setActiveTab] = useState<"resources" | "assignments">(
    "resources",
  );

  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  return (
    <div className="mt-10">
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("resources")}
            className={`border-b-2 pb-4 text-sm font-semibold transition ${
              activeTab === "resources"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Resources ({resources.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("assignments")}
            className={`border-b-2 pb-4 text-sm font-semibold transition ${
              activeTab === "assignments"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Assignments ({assignments.length})
          </button>
        </div>
      </div>

      {/* Resources */}
      {activeTab === "resources" && (
        <section className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Learning Resources
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage learning materials for {studentName}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowResourceForm((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
            >
              <span className="mr-2 text-lg">+</span>
              {showResourceForm ? "Close" : "Add Resource"}
            </button>
          </div>

          {showResourceForm && (
            <div className="mt-6">
              <AddResourceForm studentId={studentId} />
            </div>
          )}

          <div className="mt-6">
            {resources.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                  📚
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No resources yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Add learning materials for {studentName}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    subjects={subjects}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Assignments */}
      {activeTab === "assignments" && (
        <section className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>

              <p className="mt-1 text-sm text-slate-500">
                Create and manage assignments for {studentName}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAssignmentForm((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
            >
              <span className="mr-2 text-lg">+</span>
              {showAssignmentForm ? "Close" : "Add Assignment"}
            </button>
          </div>

          {showAssignmentForm && (
            <div className="mt-6">
              <AddAssignmentForm studentId={studentId} />
            </div>
          )}

          <div className="mt-6">
            {assignments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-2xl">
                  📝
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No assignments yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Create an assignment for {studentName}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/* ----------------------------- */
/* Assignment Card               */
/* ----------------------------- */

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-xl">
          📝
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            assignment.status === "completed"
              ? "bg-green-50 text-green-600"
              : assignment.status === "in_progress"
                ? "bg-blue-50 text-blue-600"
                : "bg-amber-50 text-amber-600"
          }`}
        >
          {assignment.status.replace("_", " ")}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {assignment.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
        {assignment.description}
      </p>

      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">Due:</span>{" "}
          {assignment.due_day
            ? new Date(assignment.due_day).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No due date"}
        </p>

        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">File:</span>{" "}
          {assignment.file_required ? "Required" : "Not required"}
        </p>
        {assignment.file && (
          <div className="mt-4 rounded-2xl bg-green-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Attachment
            </p>

            <p className="mt-2 truncate text-sm font-semibold text-slate-800">
              📎 {assignment.file.file_name}
            </p>

            <button
              type="button"
              onClick={async () => {
                console.log("FILE PATH:", assignment.file?.file_path);
                const { data, error } = await supabase.storage
                  .from("assignment-files")
                  .createSignedUrl(assignment.file!.file_path, 60 * 60);

                if (error) {
                  console.error("FILE URL ERROR:", error);
                  alert("Unable to open attachment.");
                  return;
                }

                window.open(data.signedUrl, "_blank");
              }}
              className="mt-2 text-sm font-semibold text-green-700 hover:text-green-800"
            >
              Open attachment →
            </button>
          </div>
        )}
      </div>

      <AssignmentCardActions assignment={assignment} />
    </article>
  );
}

/* ----------------------------- */
/* Resource Card                  */
/* ----------------------------- */

function ResourceCard({
  resource,
  subjects,
}: {
  resource: Resource;
  subjects: Subject[];
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
          {getResourceIcon(resource.type)}
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {resource.type}
        </span>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        {resource.subject}
      </p>

      <h3 className="mt-2 text-lg font-bold text-slate-900">
        {resource.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
        {resource.describe}
      </p>

      <p className="mt-2 text-right text-sm font-semibold text-indigo-500">
        {new Date(resource.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Open resource →
        </a>

        <ResourceCardActions resource={resource} subjects={subjects} />
      </div>
    </article>
  );
}

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
