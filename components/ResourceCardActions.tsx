"use client";

import { useState } from "react";
import EditResourceModal from "./EditResourceForm";
import DeleteResourceButton from "./DeleteResourceButton";

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

interface ResourceCardActionsProps {
  resource: Resource;
  subjects: { id: string; name: string }[];
}

export default function ResourceCardActions({
  resource,
  subjects,
}: ResourceCardActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Edit */}
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-100"
        >
          Edit
        </button>

        {/* Delete */}
        <DeleteResourceButton
          resourceId={resource.id}
          resourceUrl={resource.url}
        />
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <EditResourceModal
          resource={resource}
          subjects={subjects}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
}
