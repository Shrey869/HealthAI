"use client";

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { AlertTriangle, CheckCircle, Info, RefreshCw, Activity, FileText } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReportResult({ data, onReset }: { data: any, onReset: () => void }) {
  const { reportData, abnormalFindings, summary, healthScore } = data;

  const normalCount = reportData.length - abnormalFindings.length;
  const abnormalCount = abnormalFindings.length;

  const chartData = {
    labels: ['Normal', 'Abnormal'],
    datasets: [
      {
        data: [normalCount, abnormalCount],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green
          'rgba(239, 68, 68, 0.8)', // Red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const getScoreColor = (score: string) => {
    switch(score) {
      case 'Good': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Moderate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'NORMAL':
        return <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-xs font-medium border border-green-500/20"><CheckCircle className="inline w-3 h-3 mr-1"/>Normal</span>;
      case 'LOW':
        return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-md text-xs font-medium border border-yellow-500/20">Low</span>;
      case 'HIGH':
        return <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs font-medium border border-red-500/20"><AlertTriangle className="inline w-3 h-3 mr-1"/>High</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Section: Score & Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Health Score Card */}
        <div className="col-span-1 md:col-span-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-32 h-32 text-indigo-500" />
          </div>
          <h2 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Overall Health Score</h2>
          <div className={`inline-flex items-center px-4 py-2 rounded-xl text-3xl font-bold border w-max mb-4 ${getScoreColor(healthScore)}`}>
            {healthScore}
          </div>
          <div className="mt-2 text-slate-300 relative z-10 text-lg leading-relaxed">
            <span className="font-semibold text-white">AI Analysis:</span> {summary}
          </div>
        </div>

        {/* Chart Card */}
        <div className="col-span-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
           <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Parameters Overview</h3>
           <div className="w-48 h-48">
             <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-semibold text-white flex items-center">
             <FileText className="mr-2 w-5 h-5 text-blue-400" /> Extracted Parameters
           </h3>
           <button 
             onClick={onReset}
             className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors flex items-center"
           >
             <RefreshCw className="w-4 h-4 mr-2" /> Analyze Another
           </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-sm">
                <th className="pb-3 px-4 font-medium">Parameter</th>
                <th className="pb-3 px-4 font-medium">Value</th>
                <th className="pb-3 px-4 font-medium">Reference Range</th>
                <th className="pb-3 px-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 text-sm">
              {reportData.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">{item.parameter}</td>
                  <td className="py-4 px-4 font-bold text-blue-300">{item.value} <span className="text-slate-500 font-normal text-xs">{item.unit}</span></td>
                  <td className="py-4 px-4">{item.min} - {item.max} <span className="text-slate-500 text-xs">{item.unit}</span></td>
                  <td className="py-4 px-4 text-right">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">No parameters extracted from the report.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
