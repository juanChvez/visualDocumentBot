import { useEffect, useState } from "react";
import { VITE_API_BASE } from "@src/config/env";
import { UploadFile } from "@src/components/UploadFile";
import { FileList } from "@src/components/FileList";
import { Upload, FileText } from "lucide-react";

function App() {
  const [message, setMessage] = useState("Cargando...");
  const [textValue, setTextValue] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch(`${VITE_API_BASE}/ping`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) =>
        setMessage("Error al conectar con backend" + JSON.stringify(err))
      );
  }, []);

  const handleProcess = () => {
    console.log("object");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            File & Text Processor
          </h1>
          <p className="text-gray-600 text-lg">
            Upload files, enter text, and view results
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Upload className="mr-3 text-blue-600" size={28} />
              File Upload
            </h2>

            <UploadFile accept="image/*" multiple={true} />

            <div className="mt-6">
              <FileList />
            </div>
          </div>
          {/* Text Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="mr-3 text-green-600" size={28} />
              Text Input
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="textInput"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter your text
                </label>
                <textarea
                  id="textInput"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Result Button */}
        <button
          onClick={handleProcess}
          className="w-full bg-gradient-to-r mb-8 from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
        >
          Process Data
        </button>

        {/* TODO: separate this for show the results, for now is hidden */}
        {/* Result Section */}
        {/* <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Result</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label
                htmlFor="resultArea"
                className="block text-sm font-medium text-gray-700"
              >
                Output / Result
              </label>
              <button
                onClick={() => setResult("")}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                Clear
              </button>
            </div>

            <textarea
              id="resultArea"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Results will appear here..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            />
          </div>
        </div> */}
        {/* Stats Bar */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-gray-600 font-medium">Files Uploaded</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {textValue.length}
            </div>
            <div className="text-gray-600 font-medium">Characters</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {result.length}
            </div>
            <div className="text-gray-600 font-medium">Result Length</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default App;
