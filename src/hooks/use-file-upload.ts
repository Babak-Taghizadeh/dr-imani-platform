import { useState } from "react";

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const setSelectedFile = (file: File | null) => {
    setFile(file);
  };

  const uploadSelectedFile = async (
    replaceKey?: string,
  ): Promise<{
    url: string | null;
    key: string | null;
  }> => {
    if (!file) return { url: null, key: null };
    const formData = new FormData();
    formData.append("file", file);
    if (replaceKey) formData.append("replaceKey", replaceKey);

    setIsUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url, key } = await response.json();
      return { url, key };
    } catch (error) {
      console.error("Error uploading file:", error);
      return { url: null, key: null };
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
  };

  return {
    setSelectedFile,
    uploadSelectedFile,
    file,
    reset,
    isUploading,
  };
};
