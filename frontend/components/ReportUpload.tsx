"use client";

import React, { useCallback, useState } from 'react';
import { UploadCloud, File, FileText, CheckCircle, Loader2 } from 'lucide-react';

export default function ReportUpload({ onUpload, isLoading }: { onUpload: (file: File) => void, isLoading: boolean }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Basic validation
    if (selectedFile.type.includes('pdf') || selectedFile.type.includes('image')) {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF or an Image file.");
    }
  };

  const submitFile = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Upload Your Report</h2>
      
      {!file ? (
        <label 
          htmlFor="file-upload" 
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-blue-400 hover:bg-white/5'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-blue-400' : 'text-slate-400'}`} />
            <p className="mb-2 text-sm text-slate-300">
              <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">PDF, PNG, JPG (MAX. 10MB)</p>
          </div>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept="application/pdf,image/*" 
            onChange={handleChange}
          />
        </label>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-solid border-blue-500/50 bg-blue-500/5 rounded-xl transition-all duration-300">
          <FileText className="w-16 h-16 text-blue-400 mb-4" />
          <p className="text-lg font-medium text-white mb-2">{file.name}</p>
          <p className="text-sm text-slate-400 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          
          <div className="flex gap-4">
             <button 
               onClick={() => setFile(null)} 
               className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors"
               disabled={isLoading}
             >
               Change File
             </button>
             <button 
               onClick={submitFile} 
               disabled={isLoading}
               className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center min-w-[140px]"
             >
               {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze Now"}
             </button>
          </div>
        </div>
      )}
      
      {isLoading && (
         <div className="mt-8 text-center text-blue-400 animate-pulse">
            Analyzing report with AI... Please wait.
         </div>
      )}
    </div>
  );
}
