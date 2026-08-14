"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
interface AddAssignmentFormProps {
  studentId: string;
}

export default function AddAssignmentForm({
  studentId,
}: AddAssignmentFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [status, setStatus] = useState("pending");
  const [fileRequired, setFileRequired] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter an assignment title.");
      return;
    }

    try {
      setUploading(true);

      // 1. Create assignment first
      const { data: assignment, error: assignmentError } = await supabase
        .from("assignments")
        .insert({
          student_id: studentId,
          title: title.trim(),
          description: description.trim(),
          due_day: dueDay || null,
          status,
          file_required: fileRequired,
        })
        .select()
        .single();

      if (assignmentError || !assignment) {
        console.error("ADD ASSIGNMENT ERROR:", assignmentError);
        alert(assignmentError?.message ?? "Failed to add assignment.");
        return;
      }

      // 2. Upload file if selected
      if (file) {
        const filePath = `${studentId}/${assignment.id}/${file.name}`;

        const { data: buckets, error: bucketError } =
          await supabase.storage.listBuckets();

        console.log("BUCKETS:", buckets);
        console.log("BUCKET ERROR:", bucketError);

        const { error: uploadError } = await supabase.storage
          .from("assignment-files")
          .upload(filePath, file);

        if (uploadError) {
          console.error("FILE UPLOAD ERROR:", uploadError);

          // Remove assignment if file upload fails
          await supabase.from("assignments").delete().eq("id", assignment.id);

          alert(uploadError.message);
          return;
        }

        // 3. Save file information
        const { error: fileRecordError } = await supabase
          .from("assignment_files")
          .insert({
            assignment_id: assignment.id,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_path: filePath,
          });

        if (fileRecordError) {
          console.error("FILE RECORD ERROR:", fileRecordError);

          // Remove uploaded file
          await supabase.storage.from("assignment-files").remove([filePath]);

          // Remove assignment
          await supabase.from("assignments").delete().eq("id", assignment.id);

          alert(fileRecordError.message);
          return;
        }
      }

      // 4. Reset form
      setTitle("");
      setDescription("");
      setDueDay("");
      setStatus("pending");
      setFileRequired(false);
      setFile(null);

      router.refresh();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-semibold text-green-600">New Assignment</p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Add Assignment
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a new assignment for this student.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Algebra Practice"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the assignment..."
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* Due day */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Due date
          </label>

          <input
            type="date"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">Overdue</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* File required */}
        <div className="flex items-center gap-3">
          <input
            id="file-required"
            type="checkbox"
            checked={fileRequired}
            onChange={(e) => setFileRequired(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />

          <label
            htmlFor="file-required"
            className="text-sm font-medium text-slate-700"
          >
            Student is required to submit a file
          </label>
        </div>

        {/* Attachment */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Attachment
          </label>

          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
            }}
            className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100"
          />

          {file && (
            <p className="mt-2 text-sm text-slate-500">
              Selected:{" "}
              <span className="font-semibold text-slate-700">{file.name}</span>
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Creating Assignment..." : "Add Assignment"}
        </button>
      </div>
    </div>
  );
}
