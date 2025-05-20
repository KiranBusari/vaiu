import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { useFileUpload } from "../api/use-file-upload";
import { useForm } from "react-hook-form";
import { fileUploadSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

const FileUploader = ({
  onCancel,
  onUpload,
}: {
  onCancel: () => void;
  onUpload?: (files: File[]) => Promise<void>;
}) => {
  const [error, setError] = useState<string | null>(null);

  const uploadForm = useForm<{ file: File | null }>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      file: null,
    },
  });

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      uploadForm.setValue("file", files[0]);
      setError(null); // Clear any previous errors when a new file is selected
    }
  };

  const { mutate, isPending } = useFileUpload();

  const handleSubmit = async () => {
    try {
      const file = uploadForm.getValues().file;
      if (!file) {
        setError("Please select a file to upload");
        return;
      }

      if (onUpload) {
        await onUpload([file]);
      } else {
        await mutate({ form: { file } });
      }

      setError(null);
      uploadForm.reset();
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload file. Please try again.");
    }
  };

  return (
    <div className="w-full p-4">
      <FileUpload onChange={handleFileChange} accept=".md,.pdf" />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-4 flex gap-8">
        <Button
          className="w-full"
          onClick={onCancel}
          disabled={isPending}
          variant="outline"
        >
          Cancel
        </Button>
        <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
