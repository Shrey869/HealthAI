"use client";

import React, { useState } from 'react';
import ReportUpload from '@/components/ReportUpload';
import ReportResult from '@/components/ReportResult';
import { Activity } from 'lucide-react';
import axios from 'axios';

export default function ReportAnalyzerPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('report', file);

    try {
      // Use Next.js API route — no separate backend server needed
      const response = await axios.post('/api/report/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setReportData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the report. Please ensure the backend and AI service are running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReportData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 opacity-20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 opacity-20 blur-[150px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
        <header className="mb-12 text-center">
          <div className="flex justify-center items-center mb-4">
             <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20 mr-4">
                <Activity size={32} className="text-white" />
             </div>
             <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
               AI Medical Analyzer
             </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload your lab report to instantly extract values, check them against normal ranges, and get an AI-driven summary of your health.
          </p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center animate-pulse">
            {error}
          </div>
        )}

        {!reportData ? (
          <div className="transition-all duration-500 ease-in-out">
            <ReportUpload onUpload={handleFileUpload} isLoading={isLoading} />
          </div>
        ) : (
          <div className="transition-all duration-500 ease-in-out animate-in slide-in-from-bottom-8 fade-in">
            <ReportResult data={reportData} onReset={handleReset} />
          </div>
        )}
        
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>This tool is for informational purposes only and does not replace professional medical advice.</p>
        </footer>
      </div>
    </div>
  );
}
