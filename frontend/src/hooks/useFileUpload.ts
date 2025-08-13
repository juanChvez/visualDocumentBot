import { useCallback } from 'react';
import { useFileStore } from '../stores/fileStore';
import { VITE_API_BASE } from "@src/config/env";

interface readImageResponse {
  error?: string,
  response: {
    content: string,
    valid: boolean
  }
}

export const useFileUpload = () => {
  const {
    files,
    isUploading,
    addFile,
    addFiles,
    removeFile,
    removeAllFiles,
    updateFileStatus,
    updateUploadProgress,
    setUploading,
    getFilesByStatus,
    getTotalSize,
    getFileCount,
    setContext,
  } = useFileStore();

  const handleFileUpload = useCallback((file: File) => {
    addFile(file);
  }, [addFile]);

  const handleFilesUpload = useCallback((files: File[]) => {
    addFiles(files);
  }, [addFiles]);

  const uploadFile = useCallback(async (fileId: string, uploadUrl: string) => {
    return new Promise((resolve, reject) => {
      const fileItem = useFileStore.getState().getFileById(fileId);
      if (!fileItem) return;

      try {
        updateFileStatus(fileId, 'uploading');
        setUploading(true);

        const formData = new FormData();
        formData.append('id', fileItem.id);
        formData.append('image', fileItem.file);
        formData.append('name', fileItem.name);

        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            updateUploadProgress(fileId, progress);
          }
        });

        xhr.addEventListener('load', () => {
          const response:readImageResponse = JSON.parse(xhr.responseText);
          if (xhr.status === 200) {
            updateFileStatus(fileId, 'completed');
          } else {
            updateFileStatus(fileId, 'error', `Upload failed: ${response.error}`);
          }
          resolve(response.response.content);
        });

        xhr.addEventListener('error', () => {
          updateFileStatus(fileId, 'error', 'Upload failed');
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', `${VITE_API_BASE}/${uploadUrl}`);
        xhr.send(formData);
      } catch (error) {
        updateFileStatus(fileId, 'error', error instanceof Error ? error.message : 'Upload failed');
        reject(error);
      } finally {
        setUploading(false);
      }
    });
  }, [updateFileStatus, setUploading, updateUploadProgress]);

  const uploadAllFiles = useCallback(async (uploadUrl: string) => {
    const pendingFiles = getFilesByStatus('pending');
    
    for (const fileItem of pendingFiles) {
      const context = await uploadFile(fileItem.id, uploadUrl);
      setContext(fileItem.id, context as string);
    }
  }, [getFilesByStatus, uploadFile]);

  const getPendingFiles = useCallback(() => {
    return getFilesByStatus('pending');
  }, [getFilesByStatus]);

  const getCompletedFiles = useCallback(() => {
    return getFilesByStatus('completed');
  }, [getFilesByStatus]);

  const getErrorFiles = useCallback(() => {
    return getFilesByStatus('error');
  }, [getFilesByStatus]);

  const getUploadingFiles = useCallback(() => {
    return getFilesByStatus('uploading');
  }, [getFilesByStatus]);

  /**
   * Creates a chat ID by sending the context for each file to the backend.
   * @param createChatUrl The endpoint to create a chat (e.g., `${VITE_API_BASE}/create-chat`)
   * @returns The created chat ID as a string
   */
  const createChatWithFiles = useCallback(async (createChatUrl: string) => {
    // Gather all files with completed status and their context
    const completedFiles = getFilesByStatus('completed');
    const contexts = completedFiles.map(file => ({
      id: file.id,
      name: file.name,
      context: file.context,
    }));

    try {
      const response = await fetch(`${VITE_API_BASE}/${createChatUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: contexts }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create chat');
      }

      const data = await response.json();
      // Expecting { chat_id: string } or similar
      return data.chat_id;
    } catch (error) {
      throw error;
    }
  }, [getFilesByStatus]);

  return {
    // State
    files,
    isUploading,
    
    // Actions
    handleFileUpload,
    handleFilesUpload,
    uploadFile,
    uploadAllFiles,
    removeFile,
    removeAllFiles,
    createChatWithFiles,
    
    // Computed
    getPendingFiles,
    getCompletedFiles,
    getErrorFiles,
    getUploadingFiles,
    getTotalSize,
    getFileCount,
  };
}; 