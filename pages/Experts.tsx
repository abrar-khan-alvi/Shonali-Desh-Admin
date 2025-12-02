import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';
import { Expert } from '../types';
import { Search, Filter, ChevronRight } from 'lucide-react';

const Experts: React.FC = () => {
    const navigate = useNavigate();
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        const expertsRef = ref(database, 'Experts');
        const unsubscribe = onValue(expertsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const expertList = Object.entries(data).map(([id, val]) => ({
                    id,
                    ...(val as Omit<Expert, 'id'>)
                }));
                setExperts(expertList);
            } else {
                setExperts([]);
            }
            setLoading(false);
        });

        return () => off(expertsRef, 'value', unsubscribe);
    }, []);

    const filteredExperts = experts.filter(expert => {
        if (filterStatus === 'all') return true;
        return expert.verificationStatus === filterStatus;
    });

    if (loading) return <div className="p-8 text-center">Loading experts...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Experts</h1>
                <div className="flex items-center space-x-2">
                    <Filter size={20} className="text-gray-500" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-sm text-gray-600">
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Specialization</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredExperts.length > 0 ? (
                            filteredExperts.map((expert) => (
                                <tr key={expert.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{expert.name}</td>
                                    <td className="p-4 text-gray-600">{expert.areasOfSpecialization?.join(', ') || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${expert.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                                            expert.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {expert.verificationStatus}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => navigate(`/experts/${expert.id}`)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            View <ChevronRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No experts found with status "{filterStatus}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Experts;
