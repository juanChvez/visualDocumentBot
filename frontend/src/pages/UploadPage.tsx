import React from "react";
import { ArrowRight } from "lucide-react";
import { useFileStore } from "../stores/fileStore";
import { UploadFile } from "@src/components/UploadFile";
import { FileList } from "@src/components/FileList";
import { useFileUpload } from "@src/hooks/useFileUpload";
import { useNavigate } from "react-router-dom";

export const UploadPage: React.FC = () => {
  const { files } = useFileStore();
  const navigate = useNavigate();
  const { uploadAllFiles, getPendingFiles, getUploadingFiles, getErrorFiles, createChatWithFiles } = useFileUpload();

  const handleProcess = async () => {
    await uploadAllFiles('/detect-text');
    if (getErrorFiles().length === 0) {
      const uuid = await createChatWithFiles('/create-chat');
      navigate(`/chat/${uuid}`);
    }
  };

  return (
    <div className="px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Upload Your Image
          </h1>
          <p className="text-gray-600 text-lg">
            Step 1: Select an image to get started
          </p>
        </div>

        <div className="grid mb-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
            <UploadFile accept="image/*" multiple={true} />

            <div className="mt-6">
              <FileList />
            </div>
            {files.length > 0 && getPendingFiles().length > 0 && getUploadingFiles().length == 0 && getErrorFiles().length == 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleProcess}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center mx-auto"
                >
                  Proceed to Chat
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            )}

            {/* Show erorr */}
            {getErrorFiles().length > 0 && (
              <div className="mt-8 text-center">
                <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                  Has some files that cannot recover the text, delete them and try again.
                </div>
              </div>
            )}

            {/* Show disclaimer */}
            {getUploadingFiles().length > 0 && (
              <div className="mt-8 text-center">
                <div className="mt-2 text-smp-2">
                  Uploading your photos, this may take a few minutes, please wait.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
