import React from 'react';
import { useFileStore } from '@src/stores/fileStore';
import { FileText, Image, File, X, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';

export const FileList: React.FC = () => {
  const { files, removeFile } = useFileStore();

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    if (fileType.startsWith('text/')) {
      return <FileText className="h-5 w-5 text-green-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
      case 'uploading':
        return 'Uploading';
      default:
        return 'Pending';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No files selected</p>
        <p className="text-sm">Upload files to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 h-64 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Selected Files</h3>
        <span className="text-sm text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''}</span>
      </div>
      <div className='overflow-y-auto overflow-x-hidden space-y-3 flex-1'>

        {files.map((fileItem) => (
            <div
            key={fileItem.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                    {getFileIcon(fileItem.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {fileItem.name}
                    </p>
                    {getStatusIcon(fileItem.status)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatFileSize(fileItem.size)}</span>
                    <span>•</span>
                    <span className="capitalize">{getStatusText(fileItem.status)}</span>
                    {fileItem.uploadProgress !== undefined && fileItem.status === 'uploading' && (
                        <>
                        <span>•</span>
                        <span>{Math.round(fileItem.uploadProgress)}%</span>
                        </>
                    )}
                    </div>
                    
                    {fileItem.error && (
                    <p className="text-xs text-red-600 mt-1">{fileItem.error}</p>
                    )}
                    
                    {fileItem.uploadProgress !== undefined && fileItem.status === 'uploading' && (
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${fileItem.uploadProgress}%` }}
                        ></div>
                        </div>
                    </div>
                    )}
                </div>
                </div>
                
                <button
                onClick={() => removeFile(fileItem.id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove file"
                >
                <X className="h-4 w-4" />
                </button>
            </div>
            </div>
        ))}
      </div>
    </div>
  );
}; 