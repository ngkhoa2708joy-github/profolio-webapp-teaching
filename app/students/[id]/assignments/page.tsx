"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";

interface AssignmentFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
}

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_day: string | null;
  status: string;
  file_required: boolean;
  created_at: string;
  assignment_files: AssignmentFile[];
  assignment_submissions: AssignmentSubmission[];
}

interface AssignmentSubmission {
  id: string;
  file_name: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: number | null;
  comment: string | null;
  created_at: string;
}

export default function AssignmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [openSubmitId, setOpenSubmitId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignments() {
      const { data, error } = await supabase
        .from("assignments")
        .select(
          `
            id,
            title,
            description,
            due_day,
            status,
            file_required,
            created_at,

            assignment_files (
                id,
                file_name,
                file_path,
                file_type,
                file_size
            ),

            assignment_submissions (
                id,
                file_name,
                file_path,
                file_type,
                file_size,
                comment,
                created_at
            )
            `,
        )
        .eq("student_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching assignments:", error);
      } else {
        const sortedAssignments = (data ?? []).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setAssignments(sortedAssignments);
      }
      setLoading(false);
    }

    fetchAssignments();
  }, [id]);

  useEffect(() => {
    if (assignments.length === 0) return;
    const latestDate = assignments[0].created_at.split("T")[0];
    setSelectedDate((current) => current ?? latestDate);
  }, [assignments]);

  async function handleSubmit(assignment: Assignment) {
    setSubmitError("");

    if (assignment.file_required && !selectedFile) {
      setSubmitError("Please attach a file before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      let fileName: string | null = null;
      let filePath: string | null = null;
      let fileType: string | null = null;
      let fileSize: number | null = null;

      if (selectedFile) {
        const uniqueFileName = `${Date.now()}-${selectedFile.name}`;
        const path = `${id}/${assignment.id}/${uniqueFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("assignment-submissions")
          .upload(path, selectedFile);

        if (uploadError) throw uploadError;

        fileName = selectedFile.name;
        filePath = path;
        fileType = selectedFile.type;
        fileSize = selectedFile.size;
      }

      const { error: submissionError } = await supabase
        .from("assignment_submissions")
        .insert({
          assignment_id: assignment.id,
          student_id: id,
          file_name: fileName,
          file_path: filePath,
          file_type: fileType,
          file_size: fileSize,
          comment: comment || null,
        });

      if (submissionError) throw submissionError;

      const { error: statusError } = await supabase
        .from("assignments")
        .update({ status: "completed" })
        .eq("id", assignment.id);

      if (statusError) throw statusError;

      setOpenSubmitId(null);
      setSelectedFile(null);
      setComment("");

      window.location.reload();
    } catch (error) {
      console.error(error);
      setSubmitError("Something went wrong while submitting.");
    } finally {
      setSubmitting(false);
    }
  }

  // 5. Lấy danh sách ngày
  const assignmentDates = Array.from(
    new Set(
      assignments.map((assignment) => assignment.created_at.split("T")[0]),
    ),
  );

  // 6. Assignment của ngày đang chọn
  const selectedAssignments = assignments.filter(
    (assignment) => assignment.created_at.split("T")[0] === selectedDate,
  );

  function getStatusStyle(status: string) {
    const normalizedStatus = status.trim().toLowerCase();
    if (normalizedStatus === "pending") {
      return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200";
    }
    if (normalizedStatus === "overdue" || normalizedStatus === "over") {
      return "bg-red-100 text-red-800 ring-1 ring-red-200";
    }
    if (normalizedStatus === "completed" || normalizedStatus === "complete") {
      return "bg-green-100 text-green-800 ring-1 ring-green-200";
    }
    return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
  }

  function formatDueDay(date: string | null) {
    if (!date) return "No due date";
    const formattedDate = new Date(`${date}T00:00:00`);
    return formattedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Helper để format hiển thị ngày cho phần sidebar/dropdown
  function getDisplayDate(dateStr: string) {
    const dateObject = new Date(`${dateStr}T00:00:00`);
    return dateObject.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getCountForDate(dateStr: string) {
    return assignments.filter((a) => a.created_at.split("T")[0] === dateStr)
      .length;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-500">Loading assignments...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
          >
            <span className="text-lg">←</span> Back
          </button>

          <h1 className="mt-2 sm:mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
            Assignments
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Keep track of your assignments and deadlines.
          </p>
        </div>

        {/* Empty state */}
        {assignments.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 text-center shadow-sm">
            <div className="text-4xl">📚</div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No assignments yet
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your assignments will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* === CHỌN NGÀY (THAY ĐỔI LỚN NHẤT Ở ĐÂY) === */}
            <aside className="w-full md:sticky md:top-6 md:w-56 shrink-0 z-10">
              {/* 1. Giao diện MOBILE: Sử dụng Select Dropdown thay vì vuốt ngang */}
              <div className="md:hidden">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <select
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {assignmentDates.map((date) => (
                      <option key={date} value={date}>
                        {getDisplayDate(date)} ({getCountForDate(date)} tasks)
                      </option>
                    ))}
                  </select>
                  {/* Icon mũi tên cho Select Box */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 2. Giao diện DESKTOP: Giữ nguyên Sidebar dọc của bạn */}
              <div className="hidden md:block rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="px-3 py-2">
                  <h2 className="text-sm font-bold text-gray-900">
                    Assignments
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">Select a date</p>
                </div>
                <div className="mt-2 flex flex-col space-y-1">
                  {assignmentDates.map((date) => {
                    const isActive = selectedDate === date;
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left transition ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📅</span>
                          <span
                            className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}
                          >
                            {getDisplayDate(date)}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            isActive
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {getCountForDate(date)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
            {/* === KẾT THÚC PHẦN CHỌN NGÀY === */}

            {/* RIGHT SIDE (Nội dung chi tiết - Giữ nguyên không đổi) */}
            <div className="min-w-0 flex-1 w-full">
              {/* Selected date */}
              <div className="mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {selectedDate &&
                    new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedAssignments.length}{" "}
                  {selectedAssignments.length === 1
                    ? "assignment"
                    : "assignments"}
                </p>
              </div>

              {/* Assignment cards */}
              <div className="space-y-4 sm:space-y-5">
                {selectedAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md"
                  >
                    {/* Top row */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div>
                        <h2 className="mt-1 text-lg sm:text-xl font-bold text-gray-900">
                          {assignment.title}
                        </h2>
                      </div>

                      {/* Status */}
                      <span
                        className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusStyle(
                          assignment.status,
                        )}`}
                      >
                        {assignment.status}
                      </span>
                    </div>

                    {/* Description */}
                    {assignment.description && (
                      <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
                        {assignment.description}
                      </p>
                    )}

                    {/* Due day */}
                    <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 sm:px-4 sm:py-3">
                      <span className="text-base sm:text-lg">📅</span>

                      <div>
                        <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-indigo-500">
                          Due day
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-indigo-700">
                          {formatDueDay(assignment.due_day)}
                        </p>
                      </div>
                    </div>

                    {/* Files / Attachments */}
                    {assignment.assignment_files.length > 0 && (
                      <div className="mt-5 sm:mt-6 border-t border-gray-100 pt-4 sm:pt-5">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="text-base">📎</span>
                          <p className="text-sm font-semibold text-gray-700">
                            Attachments
                          </p>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                            {assignment.assignment_files.length}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {assignment.assignment_files.map((file) => {
                            const fileUrl = supabase.storage
                              .from("assignment-files")
                              .getPublicUrl(file.file_path).data.publicUrl;

                            return (
                              <a
                                key={file.id}
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-row items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 transition hover:border-indigo-200 hover:bg-indigo-50"
                              >
                                {/* File icon */}
                                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm sm:text-base">
                                  📄
                                </div>
                                {/* File information */}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-700 group-hover:text-indigo-700">
                                    {file.file_name}
                                  </p>
                                  <p className="mt-0.5 truncate text-[10px] sm:text-xs text-gray-400">
                                    {file.file_type || "File"}
                                  </p>
                                </div>
                                {/* Open */}
                                <span className="shrink-0 text-[10px] sm:text-xs font-semibold text-indigo-600 transition group-hover:text-indigo-700">
                                  Open →
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Your Submission */}
                    {assignment.assignment_submissions.length > 0 && (
                      <div className="mt-5 sm:mt-6 border-t border-gray-100 pt-4 sm:pt-5">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="text-base">✅</span>
                          <p className="text-sm font-semibold text-gray-700">
                            Your Submission
                          </p>
                        </div>

                        {assignment.assignment_submissions.map((submission) => (
                          <div
                            key={submission.id}
                            className="rounded-xl border border-green-100 bg-green-50 p-3 sm:p-4 mb-2"
                          >
                            {submission.file_path && submission.file_name ? (
                              <a
                                href={
                                  supabase.storage
                                    .from("assignment-submissions")
                                    .getPublicUrl(submission.file_path).data
                                    .publicUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 rounded-xl border border-green-100 bg-white px-3 py-2 sm:px-4 sm:py-3 transition hover:border-green-200 hover:bg-green-50"
                              >
                                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-green-100">
                                  📄
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-700 group-hover:text-green-700">
                                    {submission.file_name}
                                  </p>
                                  <p className="mt-0.5 truncate text-[10px] sm:text-xs text-gray-400">
                                    Submitted{" "}
                                    {new Date(
                                      submission.created_at,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <span className="shrink-0 text-[10px] sm:text-xs font-semibold text-green-600">
                                  Open →
                                </span>
                              </a>
                            ) : (
                              <p className="text-sm text-green-700">
                                Assignment submitted without a file.
                              </p>
                            )}

                            {submission.comment && (
                              <div className="mt-3">
                                <p className="text-[10px] sm:text-xs font-semibold text-gray-500">
                                  Your comment
                                </p>
                                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                                  {submission.comment}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Submission Area */}
                    <div className="mt-5 sm:mt-6 border-t border-gray-100 pt-4 sm:pt-5">
                      {openSubmitId !== assignment.id ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Ready to submit?
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {assignment.file_required
                                ? "A file is required for this assignment."
                                : "You can submit with or without a file."}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setOpenSubmitId(assignment.id);
                              setSubmitError("");
                              setSelectedFile(null);
                              setComment("");
                            }}
                            className="w-full sm:w-auto shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow"
                          >
                            Click here to submit
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 sm:p-5">
                          {/* Form header */}
                          <div className="flex flex-row items-start justify-between gap-2 sm:gap-4 mb-4">
                            <div>
                              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                                Submit Assignment
                              </h3>
                              <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
                                {assignment.file_required
                                  ? "Attach your completed work before submitting."
                                  : "You can attach a file or submit without one."}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setOpenSubmitId(null);
                                setSelectedFile(null);
                                setComment("");
                                setSubmitError("");
                              }}
                              className="shrink-0 rounded-lg bg-white px-2 py-1 text-xs sm:text-sm font-medium text-gray-500 border border-gray-200 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>

                          {/* File upload */}
                          <div className="mt-3 sm:mt-5">
                            <label className="block text-sm font-semibold text-gray-700">
                              File{" "}
                              {assignment.file_required && (
                                <span className="text-red-500">*</span>
                              )}
                            </label>

                            <label className="mt-2 flex cursor-pointer flex-col sm:flex-row items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-3 sm:px-4 sm:py-4 transition hover:border-indigo-300 hover:bg-indigo-50/40 text-center sm:text-left">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-lg">
                                📎
                              </div>

                              <div className="min-w-0 flex-1 w-full sm:w-auto">
                                <p className="truncate text-sm font-medium text-gray-700">
                                  {selectedFile
                                    ? selectedFile.name
                                    : "Choose a file to upload"}
                                </p>
                                <p className="mt-0.5 truncate text-[10px] sm:text-xs text-gray-400">
                                  {selectedFile
                                    ? "File selected"
                                    : "Click here to browse your files"}
                                </p>
                              </div>

                              <span className="w-full sm:w-auto shrink-0 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 text-center">
                                Browse
                              </span>

                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  setSelectedFile(e.target.files?.[0] ?? null)
                                }
                              />
                            </label>

                            {selectedFile && (
                              <button
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="mt-2 block w-full sm:w-auto text-right sm:text-left text-xs font-medium text-red-500 hover:text-red-600"
                              >
                                Remove file
                              </button>
                            )}
                          </div>

                          {/* Comment */}
                          <div className="mt-4 sm:mt-5">
                            <label className="block text-sm font-semibold text-gray-700">
                              Comment
                              <span className="ml-1 font-normal text-gray-400">
                                (optional)
                              </span>
                            </label>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Add a comment for your teacher..."
                              rows={3}
                              className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                          </div>

                          {/* Error */}
                          {submitError && (
                            <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                              {submitError}
                            </div>
                          )}

                          {/* Submit action */}
                          <div className="mt-4 sm:mt-5 flex justify-end">
                            <button
                              onClick={() => handleSubmit(assignment)}
                              disabled={submitting}
                              className="w-full sm:w-auto rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {submitting ? "Submitting..." : "Submit"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
