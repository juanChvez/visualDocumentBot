import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useFileUpload } from "@src/hooks/useFileUpload";

interface UploadFileProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export const UploadFile: React.FC<UploadFileProps> = ({
  accept = "*/*",
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFilesUpload, getUploadingFiles } = useFileUpload();

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    if (!files || files.length == 0) return;

    const valid = files.every((file) => validateFile(file));
    if (!valid) return;

    handleFilesUpload(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files || files.length == 0) return;

    const valid = files.every((file) => validateFile(file));
    if (!valid) return;

    handleFilesUpload(files);
  };

  const validateFile = (file: File): boolean => {
    setError("");

    // Check file size
    if (file.size > maxSize) {
      setError(
        `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
      );
      return false;
    }

    // Check file type if accept is specified
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const fileType = file.type;

      const isValidType = acceptedTypes.some((type) => {
        // Check for MIME type (e.g., "image/jpeg")
        if (type.includes("/")) {
          return (
            fileType === type || fileType.startsWith(type.replace("*", ""))
          );
        }
        // Check for file extension (e.g., ".jpg", ".pdf")
        if (type.startsWith(".")) {
          return fileExtension === type.toLowerCase();
        }
        // Check for wildcard (e.g., "image/*")
        if (type.endsWith("/*")) {
          const baseType = type.replace("/*", "");
          return fileType.startsWith(baseType);
        }
        return false;
      });

      if (!isValidType) {
        setError(`File type not allowed. Accepted types: ${accept}`);
        return false;
      }
    }

    return true;
  };

  return (
    <div className="w-full">
      <input
        disabled={getUploadingFiles().length > 0}
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="text-gray-600">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center m-auto mb-6">
            <Upload size={40} className="text-blue-600" />
          </div>
          <p className="text-lg font-medium">
            {multiple
              ? "Drop files here or click to browse"
              : "Drop a file here or click to browse"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {accept !== "*/*"
              ? `Accepted formats: ${accept}`
              : "All file types accepted"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Max size: {Math.round(maxSize / 1024 / 1024)}MB
            {multiple && " per file"}
          </p>
        </div>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}
    </div>
  );
};
