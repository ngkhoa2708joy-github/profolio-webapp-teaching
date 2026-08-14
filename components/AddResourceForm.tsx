"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

interface AddResourceFormProps {
  studentId: string;
}

export default function AddResourceForm({ studentId }: AddResourceFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("PDF");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [subjects, setSubjects] = useState<any[]>([]);
  useEffect(() => {
    async function fetchSubjects() {
      console.log("studentId:", studentId);

      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("student_id", studentId);

      console.log("subjects:", data);
      console.log("error:", error);

      if (error) {
        console.error(error);
        return;
      }

      setSubjects(data ?? []);
    }

    fetchSubjects();
  }, [studentId]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    // Remove extension from filename
    const fileNameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "");

    // Automatically use filename as title
    setTitle(fileNameWithoutExtension);

    // Automatically detect type
    if (selectedFile.type === "application/pdf") {
      setType("PDF");
    } else if (
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      selectedFile.type === "application/msword"
    ) {
      setType("Word");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!file) {
      setError("Please choose a file.");
      return;
    }

    setLoading(true);

    try {
      // Create a unique file name
      const fileExtension = file.name.split(".").pop() || "";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      // Store files inside the student's folder
      const filePath = `${studentId}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("learning-resources")
        .upload(filePath, file);

      if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError);
        setError("Unable to upload file.");
        setLoading(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("learning-resources")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Save metadata in database
      const { error: databaseError } = await supabase
        .from("learning_resource")
        .insert({
          student_id: studentId,
          title,
          subject,
          type,
          describe: description,
          url: publicUrl,
        });

      if (databaseError) {
        console.error(
          "DATABASE ERROR:",
          JSON.stringify(databaseError, null, 2),
        );

        setError(`Database error: ${databaseError.message}`);

        setLoading(false);
        return;
      }

      // Reset form
      setTitle("");
      setSubject("Math");
      setType("PDF");
      setDescription("");
      setFile(null);

      // Reset file input
      const fileInput = document.getElementById(
        "resource-file",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setLoading(false);

      // Refresh server component
      router.refresh();
    } catch (err) {
      console.error("UNEXPECTED ERROR:", err);

      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900">
          Add Learning Resource
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Upload a learning material for this student.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* File */}
        <div className="sm:col-span-2">
          <label
            htmlFor="resource-file"
            className="text-sm font-semibold text-slate-700"
          >
            File
          </label>

          <input
            id="resource-file"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
            className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-indigo-600 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700"
          />

          <p className="mt-2 text-xs text-slate-400">
            Supported files: PDF, DOC, DOCX
          </p>
        </div>

        {/* Title */}
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What is your title ?"
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-1 text-xs text-slate-400">
            Automatically filled from the file name. You can edit it.
          </p>
        </div>

        {/* Subject */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Subject
          </label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-semibold text-slate-700">Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          >
            <option value="PDF">PDF</option>
            <option value="Word">Word</option>
            <option value="Homework">Homework</option>
            <option value="Exercise">Exercise</option>
            <option value="Video">Video</option>
            <option value="Link">Link</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe this resource..."
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload Resource"}
        </button>
      </div>
    </form>
  );
}
