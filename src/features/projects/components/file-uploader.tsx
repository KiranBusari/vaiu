import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useState, useEffect } from "react";
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
  const [preview, setPreview] = useState<{
    name: string;
    type: string;
    content?: string;
    url?: string;
  } | null>(null);

  const uploadForm = useForm<{ file: File | null }>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      file: null,
    },
  });

  const handleFileChange = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      uploadForm.setValue("file", selectedFile);

      // Create a preview with file metadata
      const previewData = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      };

      try {
        // Generate preview content based on file type
        if (selectedFile.type === "application/pdf") {
          // For PDF files, create an object URL for preview
          const url = URL.createObjectURL(selectedFile);
          setPreview({ ...previewData, url });
        } else if (
          selectedFile.type === "text/markdown" ||
          selectedFile.name.endsWith(".md")
        ) {
          // For markdown or text files, read as text
          const content = await selectedFile.text();
          setPreview({ ...previewData, content });
        } else {
          // For other file types
          setPreview(previewData);
        }
      } catch (err) {
        console.error("Error generating preview:", err);
        setPreview(previewData);
      }

      setError(null); // Clear any previous errors when a new file is selected
    }
  };

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview]);

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
        mutate({ form: { file } });
      }

      setError(null);
      uploadForm.reset();
      setPreview(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload file. Please try again.");
    }
  };

  return (
    <div className="w-full p-4">
      <FileUpload onChange={handleFileChange} accept=".md,.pdf" />

      {error && (
        <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
      )}

      {/* Enhanced File Preview Section with better UI */}
      {preview && (
        <div className="mt-4 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
          {/* File header with metadata */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                {preview.type.includes("pdf") ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                )}
              </span>
              <div className="ml-3">
                <p className="max-w-xs truncate text-sm font-medium text-gray-900">
                  {preview.name}
                </p>
              </div>
            </div>
          </div>

          {/* Content Preview with improved layout */}
          <div className="p-4">
            {preview.url && preview.type.includes("pdf") && (
              <div className="overflow-hidden rounded-md border border-gray-200">
                <iframe
                  src={preview.url}
                  className="h-96 w-full"
                  title="PDF Preview"
                />
              </div>
            )}

            {preview.content && (
              <div className="max-h-96 overflow-auto rounded-md border border-gray-200 bg-gray-50">
                <div className="whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed text-gray-800">
                  {preview.content}
                </div>
              </div>
            )}

            {!preview.url && !preview.content && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  Preview not available for this file type
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <Button
          className="w-full"
          onClick={onCancel}
          disabled={isPending}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isPending || !preview}
        >
          {isPending ? (
            <span className="flex items-center">
              <svg
                className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload"
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
