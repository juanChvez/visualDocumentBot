import { useCallback } from 'react';
import { useFileStore } from '../stores/fileStore';

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
  } = useFileStore();

  const handleFileUpload = useCallback((file: File) => {
    addFile(file);
  }, [addFile]);

  const handleFilesUpload = useCallback((files: File[]) => {
    addFiles(files);
  }, [addFiles]);

  const uploadFile = useCallback(async (fileId: string, uploadUrl: string) => {
    const fileItem = useFileStore.getState().getFileById(fileId);
    if (!fileItem) return;

    try {
      updateFileStatus(fileId, 'uploading');
      setUploading(true);

      const formData = new FormData();
      formData.append('file', fileItem.file);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          updateUploadProgress(fileId, progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          updateFileStatus(fileId, 'completed');
        } else {
          updateFileStatus(fileId, 'error', `Upload failed: ${xhr.statusText}`);
        }
      });

      xhr.addEventListener('error', () => {
        updateFileStatus(fileId, 'error', 'Upload failed');
      });

      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    } catch (error) {
      updateFileStatus(fileId, 'error', error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [updateFileStatus, setUploading, updateUploadProgress]);

  const uploadAllFiles = useCallback(async (uploadUrl: string) => {
    const pendingFiles = getFilesByStatus('pending');
    
    for (const fileItem of pendingFiles) {
      await uploadFile(fileItem.id, uploadUrl);
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
    
    // Computed
    getPendingFiles,
    getCompletedFiles,
    getErrorFiles,
    getUploadingFiles,
    getTotalSize,
    getFileCount,
  };
}; 