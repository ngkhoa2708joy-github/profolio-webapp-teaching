"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

interface Assignment {
  id: string;
  student_id: string;
  title: string;
  description: string;
  due_day: string;
  status: string;
  created_at: string;
  file_required: boolean;
}

export default function AssignmentCardActions({
  assignment,
}: {
  assignment: Assignment;
}) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [dueDay, setDueDay] = useState(assignment.due_day ?? "");
  const [status, setStatus] = useState(assignment.status);
  const [fileRequired, setFileRequired] = useState(assignment.file_required);

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!title.trim()) {
      alert("Please enter an assignment title.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("assignments")
      .update({
        title: title.trim(),
        description: description.trim(),
        due_day: dueDay || null,
        status,
        file_required: fileRequired,
      })
      .eq("id", assignment.id);

    setLoading(false);

    if (error) {
      console.error("UPDATE ASSIGNMENT ERROR:", error);
      alert(error.message);
      return;
    }

    setIsEditing(false);
    router.refresh();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${assignment.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", assignment.id);

    if (error) {
      console.error("DELETE ASSIGNMENT ERROR:", error);
      alert(error.message);
      return;
    }

    router.refresh();
  };

  if (isEditing) {
    return (
      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            placeholder="Assignment title"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            placeholder="Assignment description"
          />

          <input
            type="date"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={fileRequired}
              onChange={(e) => setFileRequired(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Student is required to submit a file
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="text-sm font-semibold text-green-600 hover:text-green-700"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="text-sm font-semibold text-red-500 hover:text-red-600"
      >
        Delete
      </button>
    </div>
  );
}
