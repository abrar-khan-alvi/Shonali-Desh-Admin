import React, { useState } from 'react';
import { Report, Feedback } from '../types';
import { Search, Star, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const MOCK_DISPUTES: Report[] = [
  { id: 'R1', sessionId: 'S1029', reportedBy: 'Farmer', farmerName: 'Rahim Mia', expertName: 'Dr. Rafiqul', issue: 'Expert did not join the call', dateReported: '2023-11-20', status: 'New' },
  { id: 'R2', sessionId: 'S1035', reportedBy: 'Expert', farmerName: 'Karim Uddin', expertName: 'Prof. Malek', issue: 'Abusive language used', dateReported: '2023-11-21', status: 'In Review' },
];

const MOCK_FEEDBACK: Feedback[] = [
  { id: 'F1', date: '2023-11-20', farmerName: 'Abdul Halim', expertName: 'Dr. Shireen', rating: 5, text: 'Very helpful advice saved my crops!' },
  { id: 'F2', date: '2023-11-19', farmerName: 'Jamal Hossain', expertName: 'Dr. Rafiqul', rating: 4, text: 'Good but audio was cutting out.' },
  { id: 'F3', date: '2023-11-18', farmerName: 'Fatema Akter', expertName: 'Ms. Nasrin', rating: 5, text: 'Excellent diagnosis.' },
];

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Disputes' | 'Feedback'>('Disputes');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reports & Feedback</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('Disputes')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'Disputes' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Disputes ({MOCK_DISPUTES.length})
        </button>
        <button 
          onClick={() => setActiveTab('Feedback')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'Feedback' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          All Feedback
        </button>
      </div>

      {activeTab === 'Disputes' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                <th className="p-4 font-semibold">Session ID</th>
                <th className="p-4 font-semibold">Reported By</th>
                <th className="p-4 font-semibold">Involved Parties</th>
                <th className="p-4 font-semibold">Issue</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DISPUTES.map(report => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-500 font-mono">#{report.sessionId}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700">{report.reportedBy}</span>
                  </td>
                  <td className="p-4 text-sm">
                    <p><span className="text-gray-400">Farmer:</span> {report.farmerName}</p>
                    <p><span className="text-gray-400">Expert:</span> {report.expertName}</p>
                  </td>
                  <td className="p-4 text-gray-800 font-medium">{report.issue}</td>
                  <td className="p-4">
                    <span className={`flex items-center text-sm font-medium ${
                      report.status === 'New' ? 'text-red-600' :
                      report.status === 'In Review' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {report.status === 'New' && <AlertTriangle size={16} className="mr-1" />}
                      {report.status === 'In Review' && <Clock size={16} className="mr-1" />}
                      {report.status === 'Resolved' && <CheckCircle size={16} className="mr-1" />}
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="px-3 py-1.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-green-50">
                      View & Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
           {/* Search Bar for Feedback */}
           <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search feedback..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-80"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Farmer</th>
                  <th className="p-4 font-semibold">Expert</th>
                  <th className="p-4 font-semibold">Rating</th>
                  <th className="p-4 font-semibold">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_FEEDBACK.map(feedback => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-500">{feedback.date}</td>
                    <td className="p-4 text-sm font-medium text-gray-800">{feedback.farmerName}</td>
                    <td className="p-4 text-sm text-gray-600">{feedback.expertName}</td>
                    <td className="p-4">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < feedback.rating ? "currentColor" : "none"} stroke="currentColor" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 italic">"{feedback.text}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
