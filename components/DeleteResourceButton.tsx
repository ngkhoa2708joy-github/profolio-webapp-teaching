"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

interface DeleteResourceButtonProps {
  resourceId: string;
  resourceUrl: string;
}

export default function DeleteResourceButton({
  resourceId,
  resourceUrl,
}: DeleteResourceButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?",
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      // Get file path from public URL
      const url = new URL(resourceUrl);
      const marker = "/storage/v1/object/public/learning-resources/";

      const filePath = decodeURIComponent(url.pathname.split(marker)[1] || "");

      if (!filePath) {
        console.error("Could not determine file path from URL");
        alert("Unable to determine the file path.");
        setLoading(false);
        return;
      }

      // Delete file from Storage
      const { error: storageError } = await supabase.storage
        .from("learning-resources")
        .remove([filePath]);

      if (storageError) {
        console.error("STORAGE DELETE ERROR:", storageError);
        alert("Unable to delete the file.");
        setLoading(false);
        return;
      }

      // Delete database record
      const { error: databaseError } = await supabase
        .from("learning_resource")
        .delete()
        .eq("id", resourceId);

      if (databaseError) {
        console.error("DATABASE DELETE ERROR:", databaseError);
        alert(
          "File was deleted, but the resource record could not be deleted.",
        );
        setLoading(false);
        return;
      }

      // Refresh the Server Component
      router.refresh();
    } catch (error) {
      console.error("DELETE ERROR:", error);
      alert("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
